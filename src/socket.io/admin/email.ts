// Chat-GPT was used for translating import statements and defining some interfaces.
import meta from '../../meta';
import userDigest from '../../user/digest';
import userEmail from '../../user/email';
import notifications from '../../notifications';
import emailer from '../../emailer';
import utils from '../../utils';

interface Socket {
    uid: number;
}

interface Notif {
    type: string;
    bodyShort: string;
    bodyLong: string;
    nid: string;
    path: string;
    from: number;
    subject?: string
}

interface Payload {
    subject: string;
    username?: string;
    until?: string;
    reason?: string;
}

interface EmailTemplate {
    type: string;
    bodyShort: string;
    bodyLong: string;
    nid: string;
    path: string;
    from: number;
    test?: (socket: Socket, data: { payload?: Payload; template: string }) => Promise<void>;
}

const Email: EmailTemplate = {
    type: '',
    bodyShort: '',
    bodyLong: '',
    nid: '',
    path: '',
    from: 0,
};

Email.test = async function (socket: Socket, data: { payload?: Payload; template: string }): Promise<void> {
    const payload: Payload = {
        ...(data.payload || {}),
        subject: '[[email:test-email.subject]]',
    };

    switch (data.template) {
    case 'digest':
        await userDigest.execute({
            interval: 'month',
            subscribers: [socket.uid],
        });
        break;

    case 'banned':
        Object.assign(payload, {
            username: 'test-user',
            until: utils.toISOString(Date.now()) as string,
            reason: 'Test Reason',
        });
        await emailer.send(data.template, socket.uid, payload);
        break;

    case 'verify-email':
    case 'welcome':
        await userEmail.sendValidationEmail(socket.uid, {
            force: 1,
            template: data.template,
            subject:
                data.template === 'welcome' ?
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    `[[email:welcome-to, ${meta.config.title as string || meta.config.browserTitle as string || 'NodeBB'}]]` :
                    undefined,
        });
        break;

    case 'notification': {
        const notification: Notif = await notifications.create({
            type: 'test',
            bodyShort: '[[email:notif.test.short]]',
            bodyLong: '[[email:notif.test.long]]',
            nid: `uid:${socket.uid}:test`,
            path: '/',
            from: socket.uid,
        }) as Notif;
        await emailer.send('notification', socket.uid, {
            path: notification.path,
            subject: utils.stripHTMLTags(notification.subject || '[[notifications:new_notification]]'),
            intro: utils.stripHTMLTags(notification.bodyShort),
            body: notification.bodyLong || '',
            notification,
            showUnsubscribe: true,
        });
        break;
    }

    default:
        await emailer.send(data.template, socket.uid, payload);
        break;
    }
};

export = Email;

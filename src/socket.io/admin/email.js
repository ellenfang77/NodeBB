"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const meta_1 = __importDefault(require("../../meta"));
const digest_1 = __importDefault(require("../../user/digest"));
const email_1 = __importDefault(require("../../user/email"));
const notifications_1 = __importDefault(require("../../notifications"));
const emailer_1 = __importDefault(require("../../emailer"));
const utils_1 = __importDefault(require("../../utils"));
// const Email: EmailTemplate = {
//     type: '',
//     bodyShort: '',
//     bodyLong: '',
//     nid: '',
//     path: '',
//     from: 0,
//     test: function(){},
// };
// Email.test = async function (socket: Socket, data: { payload?: Payload; template: string }): Promise<void> {
//     const payload: Payload = {
//         ...(data.payload || {}),
//         subject: '[[email:test-email.subject]]',
//     };
//     switch (data.template) {
//     case 'digest':
//         await userDigest.execute({
//             interval: 'month',
//             subscribers: [socket.uid],
//         });
//         break;
//     case 'banned':
//         Object.assign(payload, {
//             username: 'test-user',
//             until: utils.toISOString(Date.now()) as string,
//             reason: 'Test Reason',
//         });
//         await emailer.send(data.template, socket.uid, payload);
//         break;
//     case 'verify-email':
//     case 'welcome':
//         await userEmail.sendValidationEmail(socket.uid, {
//             force: 1,
//             template: data.template,
//             subject:
//                 data.template === 'welcome' ?
//                     `[[email:welcome-to, ${meta.config.title as string
// || meta.config.browserTitle as string || 'NodeBB'}]]` :
//                     undefined,
//         });
//         break;
//     case 'notification': {
//         const notification: notif = await notifications.create({
//             type: 'test',
//             bodyShort: '[[email:notif.test.short]]',
//             bodyLong: '[[email:notif.test.long]]',
//             nid: `uid:${socket.uid}:test`,
//             path: '/',
//             from: socket.uid,
//         });
//         await emailer.send('notification', socket.uid, {
//             path: notification.path,
//             subject: utils.stripHTMLTags(notification.subject || '[[notifications:new_notification]]'),
//             intro: utils.stripHTMLTags(notification.bodyShort),
//             body: notification.bodyLong || '',
//             notification,
//             showUnsubscribe: true,
//         });
//         break;
//     }
//     default:
//         await emailer.send(data.template, socket.uid, payload);
//         break;
//     }
// };
class Email {
    static test(socket, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = Object.assign(Object.assign({}, (data.payload || {})), { subject: '[[email:test-email.subject]]' });
            switch (data.template) {
                case 'digest':
                    yield digest_1.default.execute({
                        interval: 'month',
                        subscribers: [socket.uid],
                    });
                    break;
                case 'banned':
                    Object.assign(payload, {
                        username: 'test-user',
                        until: utils_1.default.toISOString(Date.now()),
                        reason: 'Test Reason',
                    });
                    yield emailer_1.default.send(data.template, socket.uid, payload);
                    break;
                case 'verify-email':
                case 'welcome':
                    yield email_1.default.sendValidationEmail(socket.uid, {
                        force: 1,
                        template: data.template,
                        subject: data.template === 'welcome' ?
                            `[[email:welcome-to, ${meta_1.default.config.title || meta_1.default.config.browserTitle || 'NodeBB'}]]` :
                            undefined,
                    });
                    break;
                case 'notification': {
                    const inputData = {
                        type: 'test',
                        bodyShort: '[[email:notif.test.short]]',
                        bodyLong: '[[email:notif.test.long]]',
                        nid: `uid:${socket.uid}:test`,
                        path: '/',
                        from: socket.uid,
                    };
                    const notification = yield notifications_1.default.create(inputData);
                    yield emailer_1.default.send('notification', socket.uid, {
                        path: notification.path,
                        subject: utils_1.default.stripHTMLTags(notification.subject || '[[notifications:new_notification]]'),
                        intro: utils_1.default.stripHTMLTags(notification.bodyShort),
                        body: notification.bodyLong || '',
                        notification,
                        showUnsubscribe: true,
                    });
                    break;
                }
                default:
                    yield emailer_1.default.send(data.template, socket.uid, payload);
                    break;
            }
        });
    }
}
exports.default = Email;

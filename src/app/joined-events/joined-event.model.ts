export class JoindEvent {
    constructor(
        public id: string,
        public eventId: string,
        public userId: string,
        public eventName: string,
        public membersCount: number
    ) {

    }
}
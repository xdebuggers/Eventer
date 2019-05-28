export class Event {

    constructor(
        public id: string,
        public name: string,
        public desc: string,
        public imgUrl: string,
        public capacity: number,
        public date: Date,
        public goingCount: number,
        public interestedCount: number,
        public userId: string
        ) {}
    }
    export class User {

        constructor(
            public name: string,
            public pass: string,

            ) {}
        }
    
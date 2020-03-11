declare module 'payload-api' {

    class ARMRequest {
        create(obj: any): Promise<any>
        update(obj: any): Promise<any>
        delete(obj?: any): Promise<any>
        select(obj?: any): Promise<any>
        get(id: string): Promise<any>
        filter_by(...args: any[]): ARMRequest
        group_by(...args: any[]): ARMRequest
        all(): Promise<[any]>
        then(onFulfilled:(value:any)=>any, onRejected?:(reason:any)=>any): Promise<[any]>
    }

    class ARMObject {
        [key: string]: any
        constructor(data: any)
        public static select(...args: any[]): ARMRequest
        public static get(id: string): Promise<any>
        public static create(obj: any, opts?: any): Promise<any>
        public static filter_by(...args: any[]): ARMRequest
        public static delete_all(objects: [any]): Promise<[any]>
        public static update_all(objects: [any]): Promise<[any]>
        public data(): any
        public json(): string
        public update(update:any, opts?:any): Promise<any>
        public delete(): Promise<any>
    }

    namespace pl {
        let api_key:string
        let api_url:string
        const attr:any

        function create(...args: any[]):any
        function update(...args: any[]):any
        //function delete(...args: any[]):any

        class AccessToken extends ARMObject {}

        class Account extends ARMObject {}

        class Customer extends Account {}

        class ProcessingAccount extends Account {}

        class Org extends ARMObject {}

        class ProcessingSettings extends Account {}

        class User extends ARMObject {}

        class APIKey extends ARMObject {}

        class Transaction extends ARMObject {}

        class Payment extends Transaction {}

        class Refund extends Transaction {}

        class Ledger extends ARMObject {}

        class PaymentMethod extends ARMObject {}

        class Card extends PaymentMethod {}

        class BankAccount extends PaymentMethod {}

        class Reader extends ARMObject {}

        class BillingSchedule extends ARMObject {}

        class BillingCharge extends ARMObject {}

        class Invoice extends ARMObject {}

        class LineItem extends ARMObject {}

        class ChargeItem extends LineItem {}

        class PaymentItem extends LineItem {}

        class PaymentLink extends ARMObject {}

        class AppSettings extends ARMObject {}

        class Webhook extends ARMObject {}

        class WebhookLog extends ARMObject {}
    }

    export default pl
}

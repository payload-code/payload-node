var ARMObject = require('./arm/object')

class AccessToken extends ARMObject {}
AccessToken.__spec__ = {'object': 'access_token'}

class Account extends ARMObject {}
Account.__spec__ = {'object': 'account'}

class Customer extends ARMObject {
	charge(payment) {
		if ( typeof(payment) == 'number' )
			payment = {amount: payment}
		payment.customer_id = this.id
		return Payment.create(payment);
	}
}
Customer.__spec__ = {'object': 'customer'}

class ProcessingAccount extends ARMObject {}
ProcessingAccount.__spec__ = {'object': 'processing_account'}

class LegalEntity extends ARMObject {}
LegalEntity.__spec__ = {'endpoint': '/legal_entities', 'object': 'legal_entity'}

class Org extends ARMObject {}
Org.__spec__ = {'endpoint': '/accounts/orgs', 'object': 'org'}

class ProcessingSettings extends Account {}
ProcessingSettings.__spec__ = {'object': 'processing_setting'}

class User extends ARMObject {}
User.__spec__ = {'object': 'user'}

class APIKey extends ARMObject {}
APIKey.__spec__ = {'object': 'api_key'}

class Transaction extends ARMObject {}
Transaction.__spec__ = {'object': 'transaction'}

class Payment extends Transaction {}
Payment.__spec__ = {'object': 'transaction',
                    'polymorphic': {'type': 'payment'}}

class Refund extends Transaction {}
Refund.__spec__ = {'object': 'transaction',
                    'polymorphic': {'type': 'refund'}}

class Credit extends Transaction {}
Credit.__spec__ = {'object': 'transaction',
                    'polymorphic': {'type': 'credit'}}

class Deposit extends Transaction {}
Deposit.__spec__ = {'object': 'transaction',
                    'polymorphic': {'type': 'deposit'}}

class Ledger extends ARMObject {}
Ledger.__spec__ = {'object': 'transaction_ledger'}

class PaymentMethod extends ARMObject {}
PaymentMethod.__spec__ = {'object': 'payment_method'}

class Card extends PaymentMethod {}
Card.__spec__ = {'object': 'payment_method',
                 'polymorphic': {'type': 'card'},
                 'field_map': ['card_number','expiry', 'card_code']}

class BankAccount extends PaymentMethod {}
BankAccount.__spec__ = {'object': 'payment_method',
                        'polymorphic': {'type': 'bank_account'},
                        'field_map': ['account_number', 'routing_number', 'account_type']}

class Reader extends ARMObject {}
Reader.__spec__ = {'object': 'reader'}

class BillingSchedule extends ARMObject {}
BillingSchedule.__spec__ = { 'object': 'billing_schedule' }

class BillingCharge extends ARMObject {}
BillingCharge.__spec__ = { 'object': 'billing_charge' }

class Invoice extends ARMObject {}
Invoice.__spec__ = { 'object': 'invoice' }

class LineItem extends ARMObject {}
LineItem.__spec__ = { 'object': 'line_item' }

class ChargeItem extends LineItem {}
ChargeItem.__spec__ = {'object': 'payment_method',
                       'polymorphic': {'entry_type': 'charge'}}

class PaymentItem extends LineItem {}
PaymentItem.__spec__ = {'object': 'payment_method',
                        'polymorphic': {'entry_type': 'payment'}}

class PaymentLink extends ARMObject {}
PaymentLink.__spec__ = {'object': 'payment_link'}

class AppSettings extends ARMObject {}
AppSettings.__spec__ = {'object': 'app_setting'}

class Webhook extends ARMObject {}
Webhook.__spec__ = { 'object': 'webhook' }

class WebhookLog extends ARMObject {}
WebhookLog.__spec__ = { 'object': 'webhook_log' }

class PaymentActivation extends ARMObject {}
PaymentActivation.__spec__ = { 'object': 'payment_activation' }

module.exports = {
    AccessToken: AccessToken,
    Account: Account,
    Customer: Customer,
    ProcessingAccount: ProcessingAccount,
    Org: Org,
    ProcessingSettings: ProcessingSettings,
    User: User,
    APIKey: APIKey,
    Transaction: Transaction,
    Ledger: Ledger,
    Payment: Payment,
    Refund: Refund,
    Credit: Credit,
    Deposit: Deposit,
    PaymentMethod: PaymentMethod,
    Card: Card,
    BankAccount: BankAccount,
    Reader: Reader,
    BillingSchedule: BillingSchedule,
    BillingCharge: BillingCharge,
    Invoice: Invoice,
    LineItem: LineItem,
    ChargeItem: ChargeItem,
    PaymentItem: PaymentItem,
    AppSettings: AppSettings,
    PaymentLink: PaymentLink,
    Webhook: Webhook,
    WebhookLog: WebhookLog,
    LegalEntity: LegalEntity,
    PaymentActivation: PaymentActivation
}

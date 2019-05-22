class PayloadError extends Error {
    constructor(description, data) {
        //if ( !description )
        //    description = this.constructor.name


        if ( data )
            description += '\n\n'+JSON.stringify(data)

        super(description)

        this.type = this.constructor.name
        this.data = data

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(description)).stack;
        }
    }

    get http_code() {
        this.constructor.http_code
    }
}

class UnknownResponse extends PayloadError {}

class BadRequest extends PayloadError {}
BadRequest.http_code = 400

class InvalidAttributes extends BadRequest {}
InvalidAttributes.http_code = 400

class Unauthorized extends PayloadError {}
Unauthorized.http_code = 401

class Forbidden extends PayloadError {}
Forbidden.http_code = 403

class NotFound extends PayloadError {}
NotFound.http_code = 404

class TooManyRequests extends PayloadError {}
TooManyRequests.http_code = 429

class InternalServerError extends PayloadError {}
InternalServerError.http_code = 500

class ServiceUnavailable extends PayloadError {}
ServiceUnavailable.http_code = 503

module.exports = {
    PayloadError: PayloadError,
    BadRequest: BadRequest,
    InvalidAttributes: InvalidAttributes,
    Unauthorized: Unauthorized,
    Forbidden: Forbidden,
    NotFound: NotFound,
    TooManyRequests: TooManyRequests,
    InternalServerError: InternalServerError,
    ServiceUnavailable: ServiceUnavailable
}

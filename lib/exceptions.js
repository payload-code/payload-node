/* eslint import/prefer-default-export: 0 */ // --> OFF

import { BadRequest } from '@armrest/client/exceptions'

export class TransactionDeclined extends BadRequest {
  /*
   * TODO:
   * constructor(...args) {
    super(...args)
        var object = utils.get_object_cls(this.details)
        if (object)
            this.details = new object(this.details)
        this.transaction = this.details
  } */
}

/**
 * This file does not have any tests because it does not need them.
 * Reason being: All validation is performed outside the boundaries
 * of this file. This is a simple container, and the only other
 * validation functions are tested by NodeJS or by the consumer.

 * Do not complain at me for not having tests for this file. They 
 * are NOT necessary. If it bothers you enough, feel free to write
 * them and submit a pull request. I am more than happy to merge.
*/

import { DToken } from './dtoken';
import { UserIdComparator } from '.';

/**
 * The interface for an ISession
 */
export interface ISession {
  userId: any;
  token: DToken;
}

/**
 * The object that represents a session for a user
 */
export class Session implements ISession {
  token: DToken;

  /**
   * An alias for token.toString()
   */
  get sessionToken() {
    return this.token.toString();
  }

  /**
   * If you are using a type for userIds in which the default === is not valid,
   * provide a function to this to validate any type of userIds. This was
   * intended to permit usage of BSON types without requiring BSON as a 
   * dependency.
   * @param cmp The function that will perform userId comparisons
   */
  static setIdComparator(cmp: UserIdComparator) {
    Session.uidComparator = cmp;
  }

  static fromObject(obj: ISession) {
    return new Session(obj.userId, obj.token.toString());
  }

  private static uidComparator: UserIdComparator = (a: any, b: any) => a === b;

  constructor(
    public userId: any,
    token?: DToken | string
  ) {
    if (!token)
      token = new DToken();
    else 
      this.token = typeof token === 'string' 
        ? new DToken(token) 
        : token;
  }


  /**
   * Validate only this session's token against a valid token string
   * @param tokenString
   */
  validateToken(tokenString: string) {
    return this.token.validateString(tokenString);
  }

  /**
   * Validate only this session's userId against another userId using the Comparator
   * @param id
   */
  validateUserId(id: any) {
    return Session.uidComparator(this.userId, id);
  }

  /**
   *
   * @param id
   * @param tokenString
   */
  validate(id: any, tokenString: string) {
    return this.validateUserId(id) && this.validateToken(tokenString);
  }
}

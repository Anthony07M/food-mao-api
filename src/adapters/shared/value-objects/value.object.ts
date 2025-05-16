import isEqual from 'lodash/isEqual';

export abstract class ValueObject {
  public equals(vo: this): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    if (vo.constructor.name !== this.constructor.name) {
      return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return isEqual(vo, this);
  }
}

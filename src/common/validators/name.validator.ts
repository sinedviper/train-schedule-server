import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsName(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isName',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          const regex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
          return regex.test(value) && value.length <= 50;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must contain only latin letters and spaces (max 50 characters)`;
        },
      },
    });
  };
}

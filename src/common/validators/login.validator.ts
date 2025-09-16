import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsLogin(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isLogin',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          const regex = /^[A-Za-z0-9\-.]{3,15}$/;
          return regex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be 3-15 characters, contain letters, numbers, - or .`;
        },
      },
    });
  };
}

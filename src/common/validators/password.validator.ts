import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          // length 6-20, at list 1 uppercase letter, 1 lowercase letter, 1 number, 1 special symbol
          const regex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~])[A-Za-z\d!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]{6,20}$/;
          return regex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be 6-20 characters, include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character`;
        },
      },
    });
  };
}

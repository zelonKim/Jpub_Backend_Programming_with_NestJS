import { registerDecorator, ValidationOptions,  ValidationArguments } from "class-validator";

export function NotIn(property: string, ValidationOptions?: ValidationOptions) {
    return (object: Object, propertyName: string) => {
      // registerDecorator를 호출하는 함수를 리턴함.
      registerDecorator({ // 인수로 데커레이터가 선언될 객체와 속성명을 받음.
        name: 'NotIn',  // 데커레이터명을 지정함.
        target: object.constructor, // 데커레이터를 객체가 생성될때 적용함.
        propertyName, 
        options: ValidationOptions, // 유효성 옵션을 지정함.
        constraints: [property], // 데커레이터가 속성에 적용되도록 제약함.
        validator: { // 유효성 검사 규칙을 지정함.
          validate(value: any, args: ValidationArguments) {
            const [relatedPropertyName] = args.constraints;
            const relatedValue = (args.object as any)[relatedPropertyName];
            return (
              typeof value === 'string' &&
              typeof relatedValue === 'string' &&
              !relatedValue.includes(value)
            );
          },
        },
      });
    }
}
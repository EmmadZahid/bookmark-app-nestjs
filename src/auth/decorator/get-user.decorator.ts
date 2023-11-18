import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//If you are thinking from where the user object is populated inside request object
//then you can check jwt.strategy.ts validate function
export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

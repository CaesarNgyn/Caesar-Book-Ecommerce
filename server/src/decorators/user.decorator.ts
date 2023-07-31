import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//custom decorator to extract the user object from the current HTTP request

//this will work the same as req.user (@Request() req)
export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
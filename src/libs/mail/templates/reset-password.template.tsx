import { Body, Heading, Link, Text } from "@react-email/components";
import { Html } from "@react-email/html";
import * as React from 'react';

interface ResetPasswordTemplate {
  domain: string;
  token: string;
}

export function ResetPasswordTemplate({
  domain,
  token,
}: ResetPasswordTemplate) {
  const confirmLink = `${domain}/auth/new-password?token=${token}`;

  return (
    <Html>
      <Body>
        <Heading>Сброс пароля</Heading>
        <Text>
            Привет! Вы запросили сброс пароля. Пожалуйста, перейдите по следующей ссылки, что бы создать новый пароль:
        </Text>
        <Link href={confirmLink}>Подтвердить сброс пароля</Link>
        <Text>
            Эта ссылка действительна в течениии 1 часа. Если вы не запрашивали подтверждение, просто проигнорируйте это сообщение.
        </Text>
      </Body>
    </Html>
  );
}

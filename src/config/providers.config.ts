import { ConfigService } from "@nestjs/config";
import { TypeOptions } from "src/auth/provider/provider.contants";
import { GoogleProvider } from "src/auth/provider/services/google.provider";

export const getProvidersConfig = async (
    configServise: ConfigService
): Promise<TypeOptions> => ({
    baseUrl: configServise.getOrThrow<string>('APPLICATION_URL'),
    services: [
        new GoogleProvider({
            client_id: configServise.getOrThrow<string>('GOOGLE_CLIENT_ID'), 
            client_secret: configServise.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
            scopes: ['email', 'profile']

        })
    ]
})
import { Injectable } from '@nestjs/common';
import { AmoService } from '../amo/amo.service';
import { AmoCustomField, AmoWebhookBody } from '../amo/amo.types';
import { BIRTHDAY_FIELD_ID, AGE_FIELD_ID } from '../amo/amo.constants';

@Injectable()
export class HookService {
    constructor(private readonly amoService: AmoService) {}

    public async handleHook(body: unknown): Promise<void> {
        const webhook = body as AmoWebhookBody;
        const isAddEvent = !!webhook.contacts?.add;
        const contacts = webhook.contacts?.add ?? webhook.contacts?.update ?? [];
        const contact = contacts[0];

        if (!contact) {
            return;
        }

        if (isAddEvent) {
            await new Promise<void>((resolve) => setTimeout(resolve, 2000));
        }

        const contactId = Number(contact.id);
        const fullContact = await this.amoService.getContact(contactId);
        const fields = fullContact.custom_fields_values ?? [];

        const birthdayField = fields.find((field) => field.field_id === BIRTHDAY_FIELD_ID);

        if (!birthdayField) {
            return;
        }

        const birthday = Number(birthdayField.values[0].value);
        const age = this.calculateAge(birthday);

        const currentAgeField = fields.find((field) => field.field_id === AGE_FIELD_ID);
        const currentAge = currentAgeField ? Number(currentAgeField.values[0].value) : null;

        if (currentAge === age) {
            return;
        }

        const fieldsToUpdate: AmoCustomField[] = [{ field_id: AGE_FIELD_ID, values: [{ value: age }] }];

        await this.amoService.updateContact(contactId, fieldsToUpdate);
    }

    private calculateAge(birthdayTimestamp: number): number {
        const birthday = new Date(birthdayTimestamp * 1000);
        const today = new Date();
        let age = today.getFullYear() - birthday.getFullYear();
        const isBeforeBirthday =
            today.getMonth() < birthday.getMonth() || (today.getMonth() === birthday.getMonth() && today.getDate() < birthday.getDate());

        if (isBeforeBirthday) {
            age -= 1;
        }

        return age;
    }
}

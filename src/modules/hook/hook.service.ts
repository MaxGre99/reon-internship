import { Injectable } from '@nestjs/common';
import { AmoService } from '../amo/amo.service';
import { AmoWebhookBody, AmoWebhookLead, AmoWebhookTask } from '../amo/amo.types';
import {
    DEAL_SERVICES_FIELD_ID,
    SERVICE_ENUM_TO_CONTACT_FIELD_MAP,
    CHECK_TASK_TYPE_ID,
    CHECK_TASK_TEXT,
    BUDGET_VERIFIED_NOTE_TEXT,
} from '../amo/amo.constants';

@Injectable()
export class HookService {
    constructor(private readonly amoService: AmoService) {}

    public async handleHook(body: unknown): Promise<void> {
        const webhook = body as AmoWebhookBody;

        if (webhook.leads?.update?.[0]) {
            await this.handleLeadUpdate(webhook.leads.update[0]);
        }

        if (webhook.task?.update?.[0]) {
            await this.handleTaskComplete(webhook.task.update[0]);
        }
    }

    private async handleLeadUpdate(webhookLead: AmoWebhookLead): Promise<void> {
        const dealId = Number(webhookLead.id);
        const deal = await this.amoService.getDeal(dealId);

        const contacts = deal._embedded?.contacts ?? [];

        if (contacts.length === 0) {
            return;
        }

        const mainContact = contacts.find((c) => c.is_main) ?? contacts[0];
        const contact = await this.amoService.getContact(mainContact.id);
        const contactFields = contact.custom_fields_values ?? [];

        const servicesField = deal.custom_fields_values?.find((f) => f.field_id === DEAL_SERVICES_FIELD_ID);

        if (!servicesField) {
            return;
        }

        const budget = servicesField.values.reduce((sum, { enum_id }) => {
            if (!enum_id) {
                return sum;
            }

            const contactFieldId = SERVICE_ENUM_TO_CONTACT_FIELD_MAP[enum_id];

            if (!contactFieldId) {
                return sum;
            }

            const priceFieldValue = Number(contactFields.find((f) => f.field_id === contactFieldId)?.values?.[0].value ?? 0);

            if (!priceFieldValue || isNaN(priceFieldValue) || !isFinite(priceFieldValue)) {
                return sum;
            }

            return sum + priceFieldValue;
        }, 0);

        const currentBudget = deal.price;

        if (currentBudget === budget) {
            return;
        }

        await this.amoService.updateDealBudget(dealId, budget);

        const tasks = await this.amoService.getDealTasks(dealId);
        const hasCheckTask = tasks.some((t) => t.text === CHECK_TASK_TEXT && !t.is_completed);

        if (!hasCheckTask) {
            await this.amoService.createTask(dealId, CHECK_TASK_TYPE_ID, CHECK_TASK_TEXT);
        }
    }

    private async handleTaskComplete(webhookTask: AmoWebhookTask): Promise<void> {
        if (webhookTask.action_close !== '1' || webhookTask.text !== CHECK_TASK_TEXT) {
            return;
        }

        const dealId = Number(webhookTask.element_id);
        await this.amoService.createDealNote(dealId, BUDGET_VERIFIED_NOTE_TEXT);
    }
}

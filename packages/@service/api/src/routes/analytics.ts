import { Route } from '../types';
import { validate } from '../middleware';
import { ResponseStatus } from '@gateway/definition';
import { InternalService, AnalyticsRequestBody } from '@dopt/app-server-sdk';
import {
  getCopyApiEvent,
  getCopyBlockIdEvent,
  getCopyBlockUsageEvent,
  getCreateApiKeyEvent,
  getDeployFlowVersionEvent,
  getEditFlowStatusEvent,
  getEditPathEvent,
  getEditTargetingRuleEvent,
  getRegenerateApiKeyEvent,
  getResetUserFlowStateEvent,
  getSignUpEvent,
  getViewEnvironmentsEvent,
  getViewFlowEvent,
  getViewFlowListingEvent,
  getViewFlowTargetingEvent,
  getViewFlowVersionEvent,
  getViewFlowVersionHistoryEvent,
  getViewUserEvent,
  getViewUserListingEvent,
  UserInfo,
} from '../utils/analytics';

export const route: Route = {
  middleware: [validate.session],
  method: 'analyticsEvent',
  implementation: {
    analyticsEvent: async (request) => {
      const { timestamp, eventProperties, ...rest } = request;
      if (eventProperties && eventProperties.event.value) {
        const { event } = eventProperties;
        const timeString = timestamp ? timestamp.toDate().toISOString() : '';
        const userInfo: UserInfo = {
          timestamp: timeString,
          ...rest,
        };

        let requestBody: AnalyticsRequestBody | undefined = undefined;

        switch (event.case) {
          case 'copyApiKeyEvent':
            requestBody = getCopyApiEvent(event.value, userInfo);
            break;
          case 'copyBlockIdEvent':
            requestBody = getCopyBlockIdEvent(event.value, userInfo);
            break;
          case 'copyBlockUsageEvent':
            requestBody = getCopyBlockUsageEvent(event.value, userInfo);
            break;
          case 'viewEnvironmentsEvent':
            requestBody = getViewEnvironmentsEvent(event.value, userInfo);
            break;
          case 'viewFlowEvent':
            requestBody = getViewFlowEvent(event.value, userInfo);
            break;
          case 'viewFlowListingEvent':
            requestBody = getViewFlowListingEvent(event.value, userInfo);
            break;
          case 'viewFlowTargetingEvent':
            requestBody = getViewFlowTargetingEvent(event.value, userInfo);
            break;
          case 'viewFlowVersionEvent':
            requestBody = getViewFlowVersionEvent(event.value, userInfo);
            break;
          case 'viewFlowVersionHistoryEvent':
            requestBody = getViewFlowVersionHistoryEvent(event.value, userInfo);
            break;
          case 'viewUserEvent':
            requestBody = getViewUserEvent(event.value, userInfo);
            break;
          case 'viewUserListingEvent':
            requestBody = getViewUserListingEvent(event.value, userInfo);
            break;
          case 'deployFlowVersionEvent':
            requestBody = getDeployFlowVersionEvent(event.value, userInfo);
            break;
          case 'regenerateApiKeyEvent':
            requestBody = getRegenerateApiKeyEvent(event.value, userInfo);
            break;
          case 'createApiKeyEvent':
            requestBody = getCreateApiKeyEvent(event.value, userInfo);
            break;
          case 'editFlowStatusEvent':
            requestBody = getEditFlowStatusEvent(event.value, userInfo);
            break;
          case 'editTargetingRuleEvent':
            requestBody = getEditTargetingRuleEvent(event.value, userInfo);
            break;
          case 'resetUserFlowStateEvent':
            requestBody = getResetUserFlowStateEvent(event.value, userInfo);
            break;
          case 'editPathEvent':
            requestBody = getEditPathEvent(event.value, userInfo);
            break;
          case 'signUpEvent':
            requestBody = getSignUpEvent(event.value, userInfo);
            break;
          default:
            requestBody = undefined;
        }

        if (requestBody) {
          await InternalService.postApiInternalAnalytics({
            xApiKey: process.env?.INTERNAL_API_KEY
              ? process.env.INTERNAL_API_KEY
              : '',
            requestBody,
          });
          return { status: ResponseStatus.ACCEPTED };
        }

        return { status: ResponseStatus.REJECTED };
      }
      return { status: ResponseStatus.REJECTED };
    },
  },
};

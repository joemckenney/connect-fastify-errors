import {
  BlockProperties,
  FlowProperties,
  WorkspaceProperties,
  CopyApiKeyEvent,
  CopyBlockIdEvent,
  CopyBlockUsageEvent,
  ViewEnvironmentsEvent,
  ViewFlowEvent,
  ViewFlowListingEvent,
  ViewFlowTargetingEvent,
  ViewFlowVersionEvent,
  ViewFlowVersionHistoryEvent,
  ViewUserEvent,
  ViewUserListingEvent,
  EnvironmentProperties,
  DeployFlowVersionEvent,
  RegenerateApiKeyEvent,
  CreateApiKeyEvent,
  EditFlowStatusEvent,
  EditTargetingRuleEvent,
  ResetUserFlowStateEvent,
  EditPathEvent,
  FlowStatus,
  SignUpEvent,
  SignInMethod,
} from '@gateway/definition';
import { BlockTypes } from '@userstate/types';
import {
  CopyApiKeyEvent as ServerCopyApiKeyEvent,
  CopyBlockIdEvent as ServerCopyBlockIdEvent,
  CopyBlockUsageEvent as ServerCopyBlockUsageEvent,
  ViewEnvironmentsEvent as ServerViewEnvironmentsEvent,
  ViewFlowEvent as ServerViewFlowEvent,
  ViewFlowListingEvent as ServerViewFlowListingEvent,
  ViewFlowTargetingEvent as ServerViewFlowTargetingEvent,
  ViewFlowVersionEvent as ServerViewFlowVersionEvent,
  ViewFlowVersionHistoryEvent as ServerViewFlowVersionHistoryEvent,
  ViewUserEvent as ServerViewUserEvent,
  ViewUserListingEvent as ServerViewUserListingEvent,
  DeployFlowVersionEvent as ServerDeployFlowVersionEvent,
  RegenerateApiKeyEvent as ServerRegenerateApiKeyEvent,
  CreateApiKeyEvent as ServerCreateApiKeyEvent,
  EditFlowStatusEvent as ServerEditFlowStatusEvent,
  EditTargetingRuleEvent as ServerEditTargetingRuleEvent,
  ResetUserFlowStateEvent as ServerResetUserFlowStateEvent,
  EditPathEvent as ServerEditPathEvent,
  SignUpEvent as ServerSignUpEvent,
} from '@dopt/analytics-events';

const getBlockProperties = (properties: BlockProperties) => {
  return {
    ...properties,
    type: properties.type as BlockTypes,
  };
};

const getFlowProperties = (
  { id, sid, name, description }: FlowProperties,
  workspaceProperties?: WorkspaceProperties
) => {
  return {
    id,
    sid,
    name,
    description,
    workspace_properties: workspaceProperties || {},
  };
};

export type UserInfo = {
  userId: number;
  timestamp: string;
  groupId: number;
  workspaceProperties?: WorkspaceProperties;
  environmentProperties?: EnvironmentProperties;
};

export const getCopyApiEvent = (
  event: CopyApiKeyEvent,
  { userId, workspaceProperties, environmentProperties, ...rest }: UserInfo
): ServerCopyApiKeyEvent | undefined => {
  return {
    event: 'COPY_API_KEY',
    userId,
    properties: {
      domain: event.domain,
      environment_properties: environmentProperties || {},
      workspace_properties: workspaceProperties || {},
      ...rest,
    },
  };
};

export const getCopyBlockIdEvent = (
  event: CopyBlockIdEvent,
  { userId, workspaceProperties, ...rest }: UserInfo
): ServerCopyBlockIdEvent | undefined => {
  if (event.blockProperties && event.flowProperties) {
    return {
      event: 'COPY_BLOCK_ID',
      userId,
      properties: {
        block_properties: getBlockProperties(event.blockProperties),
        flow_properties: getFlowProperties(
          event.flowProperties,
          workspaceProperties
        ),
        flow_version: event.flowVersion,
        ...rest,
      },
    };
  }
};

export const getCopyBlockUsageEvent = (
  event: CopyBlockUsageEvent,
  { userId, workspaceProperties, ...rest }: UserInfo
): ServerCopyBlockUsageEvent | undefined => {
  if (event.blockProperties && event.flowProperties) {
    return {
      event: 'COPY_BLOCK_USAGE',
      userId,
      properties: {
        block_properties: getBlockProperties(event.blockProperties),
        flow_properties: getFlowProperties(
          event.flowProperties,
          workspaceProperties
        ),
        flow_version: event.flowVersion,
        ...rest,
      },
    };
  }
};

export const getViewEnvironmentsEvent = (
  _event: ViewEnvironmentsEvent,
  { userId, workspaceProperties, ...rest }: UserInfo
): ServerViewEnvironmentsEvent | undefined => {
  return {
    event: 'VIEW_ENVIRONMENT',
    userId,
    properties: {
      workspace_properties: workspaceProperties || {},
      ...rest,
    },
  };
};

export const getViewFlowEvent = (
  event: ViewFlowEvent,
  { userId, workspaceProperties, environmentProperties, ...rest }: UserInfo
): ServerViewFlowEvent | undefined => {
  if (event.flowProperties) {
    return {
      event: 'VIEW_FLOW',
      userId,
      properties: {
        flow_properties: getFlowProperties(
          event.flowProperties,
          workspaceProperties
        ),
        environment_properties: environmentProperties || {},
        ...rest,
      },
    };
  }
};

export const getViewFlowListingEvent = (
  _event: ViewFlowListingEvent,
  { userId, workspaceProperties, environmentProperties, ...rest }: UserInfo
): ServerViewFlowListingEvent | undefined => {
  return {
    event: 'VIEW_FLOW_LISTING',
    userId,
    properties: {
      environment_properties: environmentProperties || {},
      workspace_properties: workspaceProperties || {},
      ...rest,
    },
  };
};

export const getViewFlowTargetingEvent = (
  event: ViewFlowTargetingEvent,
  { userId, workspaceProperties, environmentProperties, ...rest }: UserInfo
): ServerViewFlowTargetingEvent | undefined => {
  if (event.flowProperties) {
    return {
      event: 'VIEW_FLOW_TARGETING',
      userId,
      properties: {
        flow_properties: getFlowProperties(
          event.flowProperties,
          workspaceProperties
        ),
        environment_properties: environmentProperties || {},
        ...rest,
      },
    };
  }
};

export const getViewFlowVersionEvent = (
  event: ViewFlowVersionEvent,
  { userId, workspaceProperties, ...rest }: UserInfo
): ServerViewFlowVersionEvent | undefined => {
  if (event.flowProperties) {
    return {
      event: 'VIEW_FLOW_VERSION',
      userId,
      properties: {
        flow_properties: getFlowProperties(
          event.flowProperties,
          workspaceProperties
        ),
        flow_version: event.flowVersion,
        ...rest,
      },
    };
  }
};

export const getViewFlowVersionHistoryEvent = (
  event: ViewFlowVersionHistoryEvent,
  { userId, workspaceProperties, ...rest }: UserInfo
): ServerViewFlowVersionHistoryEvent | undefined => {
  if (event.flowProperties) {
    return {
      event: 'VIEW_FLOW_VERSION_HISTORY',
      userId,
      properties: {
        flow_properties: getFlowProperties(
          event.flowProperties,
          workspaceProperties
        ),
        ...rest,
      },
    };
  }
};

export const getViewUserEvent = (
  event: ViewUserEvent,
  { userId, environmentProperties, ...rest }: UserInfo
): ServerViewUserEvent | undefined => {
  return {
    event: 'VIEW_USER',
    userId,
    properties: {
      end_user_id: event.endUserId,
      end_user_properties: event.endUserProperties,
      environment_properties: environmentProperties || {},
      ...rest,
    },
  };
};

export const getViewUserListingEvent = (
  _event: ViewUserListingEvent,
  { userId, workspaceProperties, environmentProperties, ...rest }: UserInfo
): ServerViewUserListingEvent | undefined => {
  return {
    event: 'VIEW_USER_LISTING',
    userId,
    properties: {
      environment_properties: environmentProperties || {},
      workspace_properties: workspaceProperties || {},
      ...rest,
    },
  };
};

export const getDeployFlowVersionEvent = (
  event: DeployFlowVersionEvent,
  { userId, workspaceProperties, ...rest }: UserInfo
): ServerDeployFlowVersionEvent | undefined => {
  if (event.flowProperties) {
    return {
      event: 'DEPLOY_FLOW_VERSION',
      userId,
      properties: {
        flow_properties: getFlowProperties(
          event.flowProperties,
          workspaceProperties
        ),
        ...rest,
      },
    };
  }
};

export const getRegenerateApiKeyEvent = (
  event: RegenerateApiKeyEvent,
  { userId, workspaceProperties, ...rest }: UserInfo
): ServerRegenerateApiKeyEvent | undefined => {
  return {
    event: 'REGENERATE_API_KEY',
    userId,
    properties: {
      domain: event.domain,
      workspace_properties: workspaceProperties || {},
      ...rest,
    },
  };
};

export const getCreateApiKeyEvent = (
  event: CreateApiKeyEvent,
  { userId, workspaceProperties, ...rest }: UserInfo
): ServerCreateApiKeyEvent | undefined => {
  return {
    event: 'CREATE_API_KEY',
    userId,
    properties: {
      domain: event.domain,
      workspace_properties: workspaceProperties || {},
      ...rest,
    },
  };
};

export const getEditFlowStatusEvent = (
  event: EditFlowStatusEvent,
  { userId, environmentProperties, workspaceProperties, ...rest }: UserInfo
): ServerEditFlowStatusEvent | undefined => {
  if (event.flowProperties) {
    return {
      event: 'EDIT_FLOW_STATUS',
      userId,
      properties: {
        flow_properties: getFlowProperties(
          event.flowProperties,
          workspaceProperties
        ),
        flow_status:
          event.flowStatus == FlowStatus.ENABLED ? 'enabled' : 'disabled',
        environment_properties: environmentProperties || {},
        ...rest,
      },
    };
  }
};

export const getEditTargetingRuleEvent = (
  event: EditTargetingRuleEvent,
  { userId, environmentProperties, workspaceProperties, ...rest }: UserInfo
): ServerEditTargetingRuleEvent | undefined => {
  if (event.flowProperties) {
    return {
      event: 'EDIT_TARGETING_RULE',
      userId,
      properties: {
        flow_properties: getFlowProperties(
          event.flowProperties,
          workspaceProperties
        ),
        flow_status:
          event.flowStatus == FlowStatus.ENABLED ? 'enabled' : 'disabled',
        environment_properties: environmentProperties || {},
        ...rest,
      },
    };
  }
};

export const getResetUserFlowStateEvent = (
  event: ResetUserFlowStateEvent,
  { userId, environmentProperties, workspaceProperties, ...rest }: UserInfo
): ServerResetUserFlowStateEvent | undefined => {
  if (event.flowProperties) {
    return {
      event: 'RESET_USER_FLOW_STATE',
      userId,
      properties: {
        flow_properties: getFlowProperties(
          event.flowProperties,
          workspaceProperties
        ),
        end_user_id: event.endUserId,
        end_user_properties: event.endUserProperties,
        workspace_properties: workspaceProperties || {},
        environment_properties: environmentProperties || {},
        ...rest,
      },
    };
  }
};

export const getEditPathEvent = (
  event: EditPathEvent,
  { userId, ...rest }: UserInfo
): ServerEditPathEvent | undefined => {
  return {
    event: 'EDIT_PATH',
    userId,
    properties: {
      prev_block_id: event.prevBlockId,
      next_block_id: event.nextBlockId,
      label: event.label,
      ...rest,
    },
  };
};

export const getSignUpEvent = (
  event: SignUpEvent,
  { userId, workspaceProperties, ...rest }: UserInfo
): ServerSignUpEvent | undefined => {
  return {
    event: 'SIGN_UP',
    userId,
    properties: {
      invited: event.invited,
      sign_in_method:
        event.signInMethod === SignInMethod.OAUTH ? 'oauth' : 'magicLink',
      workspace_properties: workspaceProperties || {},
      ...rest,
    },
  };
};

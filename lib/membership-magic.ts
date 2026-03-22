/** Query on /profile after magic-link verify: client auto-submits stored membership draft. */
export const PROFILE_MEMBERSHIP_CALLBACK_PARAM = "membership_callback";
export const PROFILE_MEMBERSHIP_CALLBACK_VALUE = "1";

export const MAGIC_LINK_MEMBERSHIP_NEXT = `/profile?${PROFILE_MEMBERSHIP_CALLBACK_PARAM}=${PROFILE_MEMBERSHIP_CALLBACK_VALUE}`;

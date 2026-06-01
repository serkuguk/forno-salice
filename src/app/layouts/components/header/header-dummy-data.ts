import { ConnectionPositionPair } from "@angular/cdk/overlay";

export const languages = [
  {
    langage: 'Español',
    flag: 'sp'
  },
  {
    langage: 'English',
    flag: 'us'
  }
];

export const userItems = [
  {
    icon: 'far fa-user',
    label: 'Profile',
    userEvent: 'profile'
  },
  {
    icon: 'far fa-cog',
    label: 'Settings',
    userEvent: 'settings'
  },
  {
    icon: 'far fa-unlock-alt',
    label: 'Lock screen',
    userEvent: 'profile'
  },
  {
    icon: 'far fa-power-off',
    label: 'Logout',
    userEvent: 'logout'
  },
];

export const positions = [
  new ConnectionPositionPair(
    { originX: 'end', originY: 'bottom' },
    { overlayX: 'end', overlayY: 'top' }
  ),
];

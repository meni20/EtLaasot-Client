export const DRAWER_WIDTH = 250;
export const COLLAPSED_DRAWER_WIDTH = 68;

export interface SideMenuProps {
  open: boolean;
  onClose: () => void;
  persistent?: boolean;
}

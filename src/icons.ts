import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowRightArrowLeft,
  faCheck,
  faChevronDown,
  faChevronUp,
  faCalendarDays,
  faCircleCheck,
  faCircleHalfStroke,
  faClipboard,
  faClose,
  faDownload,
  faExclamation,
  faFilter,
  faPlus,
  faSchoolFlag,
  faSearch,
  faStopwatch,
  faUser,
  faUserLock,
  faUserShield,
  faListCheck,
  faPencilRuler,
  faArrowPointer,
} from '@fortawesome/free-solid-svg-icons';
import {
  faCalendar as faCalendarRegular,
  faCalendarDays as faCalendarDaysRegular,
  faCircle as faCircleRegular,
  faClipboard as faClipboardRegular,
} from '@fortawesome/free-regular-svg-icons';
import drawPolygon from '@/icons/draw-polygon.svg';
import drawPoint from '@/icons/draw-point.svg';
import drawLine from '@/icons/draw-line.svg';
import drawRectangle from '@/icons/draw-rectangle.svg';
import { FC, SVGProps } from 'react';
import { CampaignType, TaskPriority, TaskStatus } from './types';
import { Mode } from './lib/mapboxDrawModes';

export const campaignsIcon = faClipboard;
export const annotationsIcon = faPencilRuler;
export const tasksIcon = faListCheck;

export const communityAdminIcon = faUserShield;
export const communityPrivateIcon = faUserLock;

export const campaignTypeIcons: { [K in CampaignType]: IconDefinition } = {
  measurement: faStopwatch,
  education: faSchoolFlag,
  event: faCalendarDays,
  other: faClipboardRegular,
};

export const taskStatusIcons: { [K in TaskStatus]: IconDefinition } = {
  todo: faCircleRegular,
  'in progress': faCircleHalfStroke,
  done: faCircleCheck,
};

export const taskPriorityIcon = faExclamation;
export const taskPriorityIconCount: { [K in TaskPriority]: number } = {
  low: 0,
  medium: 1,
  high: 2,
};

export const taskDateIcon = faCalendarDaysRegular;
export const taskNoDateIcon = faCalendarRegular;

export const drawModeIcons: { [m in Mode]: IconDefinition | FC<SVGProps<SVGElement>> } = {
  simple_select: faArrowPointer,
  draw_polygon: drawPolygon,
  draw_point: drawPoint,
  draw_line_string: drawLine,
  draw_rectangle: drawRectangle,
};

export function isIconDefinition(i: unknown): i is IconDefinition {
  return !!(i && typeof i === 'object' && 'icon' in i);
}

export const addIcon = faPlus;
export const searchIcon = faSearch;
export const checkIcon = faCheck;
export const filterIcon = faFilter;
export const menuClosedIcon = faChevronDown;
export const menuOpenIcon = faChevronUp;
export const closeIcon = faClose;
export const userIcon = faUser;
export const sortIcon = faArrowRightArrowLeft;
export const downloadIcon = faDownload;

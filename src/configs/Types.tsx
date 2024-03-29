export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  Feed: undefined;
  Graph: undefined;
  Columns: undefined;
  Settings: undefined;
};

export type FeedParamList = {
  Feed: undefined;
};

export type GraphParamList = {
  Graph: undefined;
};

export type ColumnsParamList = {
  Columns: undefined;
};

export type SettingsParamList = {
  Settings: undefined;
  WhatFTP: undefined;
};

export type FtpDataParam = {
  docId: string,
  no: number,
  type: DataTypeParam,
  date: Date,
  ftp?: number,
  weight?: number,
  condition?: ConditionParam,
  message?: string,
}

export const DataTypeParam = {
  FTP: 'ftp',
  TOPIC: 'topic'
} as const;
export type DataTypeParam = typeof DataTypeParam[keyof typeof DataTypeParam];

export const ConditionParam = {
  GOOD: '良好',
  NORMAL: '普通',
  BAD:'悪い'
} as const;
export type ConditionParam = typeof ConditionParam[keyof typeof ConditionParam];

export const GraphState = {
  Loading: 'loading',
  DataExists: 'dataExists',
  DataNotExists: 'dataNotExists',
} as const;
export type GraphState = typeof GraphState[keyof typeof GraphState];

export type PointDataParam = {
  x: number // milliseconds
  y: number,
  ftp: number,
  weight: number,
  pwr: number,
  condition?: ConditionParam,
}

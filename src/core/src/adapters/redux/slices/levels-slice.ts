import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Fragment, Level, LevelStatus } from "../../../entities";

export type ILevelsState = {
  levels: Record<string, Level | null>;
  levelsStatus: Record<string, LevelStatus | null>;
};
export type IFetchLevelFragmentsDetailsPayload = {
  levelID: string;
  fragments: Fragment[];
};
export type IDownloadLevelPayload = {
  levelID: string;
};
export type IAddLevelsPayload = {
  levels: Level[];
};
export type IRemovePlaylistLevelsPayload = {
  playlistID: string;
};
export type IFinishLevelDownloadPayload = {
  levelID: string;
};
export type IIncLevelDownloadStatusPayload = {
  levelID: string;
};
export type ISaveLevelToFilePayload = {
  levelID: string;
};
export type ISaveLevelToFileSuccessPayload = {
  levelID: string;
};

const initialLevelsState: ILevelsState = {
  levelsStatus: {},
  levels: {},
};
export const levelsSlice = createSlice({
  name: "levels",
  initialState: initialLevelsState,
  reducers: {
    clearLevels(state) {
      state.levels = initialLevelsState.levels;
      state.levelsStatus = initialLevelsState.levelsStatus;
    },
    addLevels(state, action: PayloadAction<IAddLevelsPayload>) {
      const { levels } = action.payload;
      levels.forEach((level) => {
        state.levels[level.id] = level;
        state.levelsStatus[level.id] = {
          done: 0,
          total: 0,
          status: "init",
        };
      });
    },
    removePlaylistLevels(
      state,
      action: PayloadAction<IRemovePlaylistLevelsPayload>
    ) {
      const { playlistID } = action.payload;
      for (const id in state.levels) {
        if (state.levels.hasOwnProperty(id)) {
          const level = state.levels[id];
          if (level?.playlistID === playlistID) {
            state.levels[id] = null;
            state.levelsStatus[id] = null;
          }
        }
      }
    },
    downloadLevel(_state, _action: PayloadAction<IDownloadLevelPayload>) {},
    fetchLevelFragmentsDetails(
      state,
      action: PayloadAction<IFetchLevelFragmentsDetailsPayload>
    ) {
      const { levelID, fragments } = action.payload;

      state.levelsStatus[levelID] = {
        done: 0,
        total: fragments.length,
        status: "downloading",
      };
    },
    finishLevelDownload(
      state,
      action: PayloadAction<IFinishLevelDownloadPayload>
    ) {
      const { levelID: levelID } = action.payload;
      const levelStatus = state.levelsStatus[levelID]!;

      levelStatus.done = levelStatus.total;
      levelStatus.status = "ready";
    },
    incLevelDownloadStatus(
      state,
      action: PayloadAction<IIncLevelDownloadStatusPayload>
    ) {
      const { levelID: levelID } = action.payload;
      const levelStatus = state.levelsStatus[levelID]!;

      levelStatus.done++;
    },
    saveLevelToFile(state, action: PayloadAction<ISaveLevelToFilePayload>) {
      const { levelID } = action.payload;
      const levelStatus = state.levelsStatus[levelID]!;

      levelStatus.status = "saving";
    },
    saveLevelToFileSuccess(
      state,
      action: PayloadAction<ISaveLevelToFileSuccessPayload>
    ) {
      const { levelID: levelID } = action.payload;
      const levelStatus = state.levelsStatus[levelID]!;

      levelStatus.status = "done";
    },
  },
});

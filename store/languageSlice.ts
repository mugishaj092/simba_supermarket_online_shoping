import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Language } from "@/lib/types";

interface LanguageState {
  current: Language;
}

const initialState: LanguageState = {
  current: "en",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<Language>) {
      state.current = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("simba-lang", action.payload);
      }
    },
    hydrateLanguage(state, action: PayloadAction<Language>) {
      state.current = action.payload;
    },
  },
});

export const { setLanguage, hydrateLanguage } = languageSlice.actions;
export default languageSlice.reducer;

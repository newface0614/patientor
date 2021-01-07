import { State } from "./state";
import { Patient } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
    type: "SET_PATIENT_DETAILS";
    payload: Patient;
  }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    };

export const setPatientList = (payload: Patient[]): Action => {
  return {
    type: "SET_PATIENT_LIST",
    payload,
  };
};

export const addPatient = (payload: Patient): Action => {
  return {
    type: "ADD_PATIENT",
    payload,
  };
};

export const setPatientDetails = (payload: Patient): Action => {
  return {
    type: "SET_PATIENT_DETAILS",
    payload,
  };
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "SET_PATIENT_DETAILS":
      return {
        ...state,
        patient: action.payload,
      };
    default:
      return state;
  }
};

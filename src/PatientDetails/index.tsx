import React, { useEffect } from "react";
import axios from "axios";

import { Patient, Entry } from "../types";
import { apiBaseUrl } from "../constants";

import { Icon, Segment, Button } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { useStateValue, setPatientDetails, addEntry } from "../state";

import { EntryFormValues } from "../AddEntryModal/AddEntryForm";
import AddEntryModal from "../AddEntryModal";


const PatientDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [ { patients, patient, diagnosis }, dispatch] = useStateValue();
    const [modalOpen, setModalOpen] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | undefined>();

    const openModal = (): void => setModalOpen(true);

    const closeModal = (): void => {
        setModalOpen(false);
        setError(undefined);
    };

    const submitNewEntry = async (entry: EntryFormValues) => {
        try {
          type NewEntry = Omit<Entry, "id"> & { userId: string };
          const newEntry: NewEntry = {
            userId: id,
            ...entry,
          };

          console.log('add entry data:', newEntry);
    
          const { data: savedEntry } = await axios.post<Entry>(
            `${apiBaseUrl}/patients/${id}/entries`,
            newEntry
          );
          dispatch(addEntry(savedEntry, id));
          closeModal();
        } catch (err) {
          console.error(err.response.data);
          setError(err.response.data.error);
        }
      };

    

    useEffect(() => {
        if ( id in patients ) {
            dispatch({ type: "SET_PATIENT_DETAILS", payload: patients[id]});
        } else {
            const fetchPatient = async () => {
                try {
                    const { data: getPatient } = await axios.get<Patient>(
                        `${apiBaseUrl}/patients/${id}`
                      );
                    //   dispatch({ type: "SET_PATIENT_DETAILS", payload: getPatient});
                      dispatch(setPatientDetails(getPatient));                

                } catch (e) {
                    setError(e.message);
                    console.log(e.message);
                }
            };


            fetchPatient();
        }

    }, [dispatch, patient, patients, id]);

    if (!patient) {
        return <h1>Patient not found!</h1>;
    }

    const assertNever = (value: never): never => {
        throw new Error(
          `Unhandled discriminated union member: ${JSON.stringify(value)}`
        );
      };

    

    const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
        // console.log(entry);
        switch (entry.type) {
            case "Hospital":
                return (<h4> { entry.date } <Icon name="hospital outline" /> </h4>); //<HospitalEntry> </HospitalEntry>;
            case "OccupationalHealthcare":
                return (<> <h4>{ entry.date }  <Icon name="stethoscope" /> { entry.employerName } </h4> <i>{ entry.description }</i> </>); //<OccupationalHealthcareEntry></OccupationalHealthcareEntry>;
            case "HealthCheck":
                return (<> <h4> { entry.date } <Icon name="doctor" /> </h4>  <i>{ entry.description }</i> 
                <p>
                    <Icon
                        name={
                            entry.healthCheckRating === 0
                            ? "heart"
                            : entry.healthCheckRating === 1
                            ? "heartbeat"
                            : entry.healthCheckRating === 2
                            ? "heart outline"
                            : "heart outline"
                        }
                    /> 

                </p> </>); //<HealthCheck></HealthCheck>;
            default:
                return assertNever(entry);
        }
    };

    // console.log(id, error, patient, diagnosis, diagnosis);
    return (
        <div>
            <h1>
                {patient.name}{" "}
                <Icon
                name={
                    patient.gender === "male"
                    ? "mars"
                    : patient.gender === "female"
                    ? "venus"
                    : "transgender alternate"
                }
                />
            </h1>
            {patient.ssn && <p>ssn: {patient.ssn}</p>}
            <p>occupation: {patient.occupation}</p>
            <h2>entries</h2>
            <Button
                onClick={openModal}
                style={{ display: "inline-block", marginLeft: "24px" }}
            >
                Add New Entry
            </Button>
            <AddEntryModal
                modalOpen={modalOpen}
                onSubmit={submitNewEntry}
                onClose={closeModal}
                error={error}
            />
            {patient.entries.map( edata => (<React.Fragment key={edata.id}> <Segment>
                <EntryDetails entry={edata}/> 
                { 
                  edata.diagnosisCodes ? <ul>{edata.diagnosisCodes.map((d,i) => <React.Fragment key={d}> <li key={i}> {d}  {diagnosis[d]?.name} </li></React.Fragment>)}</ul> : null
                }
                </Segment>
                </React.Fragment>))}
            
        </div>
    );
};

export default PatientDetails;
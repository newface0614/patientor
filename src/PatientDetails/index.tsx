import React, { useEffect } from "react";
import axios from "axios";

import { Patient } from "../types";
import { apiBaseUrl } from "../constants";

import { Icon } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import { useStateValue, setPatientDetails } from "../state";

const PatientDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [ { patients, patient, diagnosis }, dispatch] = useStateValue();
    // const [modalOpen, setModalOpen] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | undefined>();

    // const openModal = (): void => setModalOpen(true);

    // const closeModal = (): void => {
    //     setModalOpen(false);
    //     setError(undefined);
    // };

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

    console.log(id, error, patient, diagnosis, diagnosis);
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
            
            {patient.entries.map( edata => (<React.Fragment key={edata.id}> <p key={edata.id}> 
                { edata.date } 
                { ` `}
                { edata.description } 
                </p> 
                { 
                  edata.diagnosisCodes ? <ul>{edata.diagnosisCodes.map((d,i) => <React.Fragment key={d}> <li key={i}> {d}  {diagnosis[d]?.name} </li></React.Fragment>)}</ul> : null
                }
                </React.Fragment>))}
            
        </div>
    );
};

export default PatientDetails;
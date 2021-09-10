import React, { useState, useEffect } from "react"
import { Link, useParams, useHistory } from "react-router-dom"
import EmployeeRepository from "../../repositories/EmployeeRepository";
import useResourceResolver from "../../hooks/resource/useResourceResolver";
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import person from "./person.png"
import "./Employee.css"
import { OxfordList } from "../../hooks/string/OxfordList";
import LocationRepository from "../../repositories/LocationRepository";


export default ({ employee }) => {
    const [animalCount, setCount] = useState(0)
    const [employeeLocations, markLocation] = useState([])
    const [classes, defineClasses] = useState("card employee")
    const { employeeId } = useParams()
    const { getCurrentUser } = useSimpleAuth()
    const { resolveResource, resource } = useResourceResolver()
    const [locations, updateLocations] = useState([])

    useEffect(() => {
        if (employeeId) {
            defineClasses("card employee--single")
        }
        resolveResource(employee, employeeId, EmployeeRepository.get)
    }, [])

    useEffect(() => {
        if (resource?.locations?.length > 0) {

            markLocation(resource.locations)
        }
    }, [resource])

    useEffect(() => {
        LocationRepository.getAll()
            .then((data) => updateLocations(data))
    }, [])

    const employeeAssignment = (id) => {
        const assignmentData = {
            userId: parseInt(employeeId),
            locationId: parseInt(id)
        }

        EmployeeRepository.assignEmployee(assignmentData)
            .then(() => {
                resolveResource(employee, employeeId, EmployeeRepository.get)
            })

    }

    return (
        <article className={classes}>
            <section className="card-body">
                <img alt="Kennel employee icon" src={person} className="icon--person" />
                <h5 className="card-title">
                    {
                        employeeId
                            ? resource.name
                            : <Link className="card-link"
                                to={{
                                    pathname: `/employees/${resource.id}`,
                                    state: { employee: resource }
                                }}>
                                {resource.name}
                            </Link>

                    }
                </h5>
                {
                    employeeId
                        ? <>
                            <section>
                                Caring for 0 animals
                            </section>
                            <section>
                                Working at {"locations" in resource && Array.isArray(resource.locations) && resource.locations.length > 0 ? OxfordList(resource?.locations, "location.name") : "unknown"}
                            </section>
                            { resource?.locations?.length >= 1 ? "" :
                                <section>
                                    <label for="locationsDropdown">Choose a location:</label>
                                    <select name="locationsDropdown" id="locationsDropdown" onChange={
                                        (event) => { employeeAssignment(event.target.value) }
                                    }>
                                        <option value="0">Select a location</option>
                                        {
                                            locations.map(
                                                (locationObject) => {
                                                    return <option key={locationObject.id} value={locationObject.id} >{locationObject.name}</option>
                                                }
                                            )
                                        }

                                    </select>
                                </section>
                            }
                        </>
                        : ""
                }

                {
                    <button className="btn--fireEmployee" onClick={() => { }}>Fire</button>
                }

            </section>

        </article>
    )
}

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
    const [location, markLocation] = useState({ name: "" })
    const [classes, defineClasses] = useState("card employee")
    const { employeeId } = useParams()
    const { getCurrentUser } = useSimpleAuth()
    const { resolveResource, resource } = useResourceResolver()
    const [locations, updateLocations] = useState([])
    const history = useHistory()

    useEffect(() => {
        if (employeeId) {
            defineClasses("card employee--single")
        }
        resolveResource(employee, employeeId, EmployeeRepository.get)
    }, [])

    useEffect(() => {
        if (resource?.employeeLocations?.length > 0) {

            markLocation(resource.employeeLocations[0])
        }
    }, [resource])

    useEffect(() => {
        LocationRepository.getAll()
        .then((data) => updateLocations(data))
    }, [])

    const employeeAssignment = (id) => {
        const assignmentData = {
            userId: employeeId,
            locationId: parseInt(id)
        }
        const refreshPage = () => {
            window.location.reload(false)
        }
        
        EmployeeRepository.assignEmployee(assignmentData)
        .then(() => {refreshPage()})
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
                            <section>
                                <label for="locationsDropdown">Choose a location:</label>
                                <select name="locationsDropdown" id="locationsDropdown" onChange={(event) => {employeeAssignment(event.target.value)}}>
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
                        </>
                        : ""
                }

                {
                    <button className="btn--fireEmployee" onClick={() => {}}>Fire</button>
                }

            </section>

        </article>
    )
}

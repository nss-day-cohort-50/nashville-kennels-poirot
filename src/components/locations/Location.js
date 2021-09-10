import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AnimalRepository from "../../repositories/AnimalRepository";
import locationImage from "./location.png"
import "./Location.css"
import LocationRepository from "../../repositories/LocationRepository";


export default ({location}) => {
    const [animals, updateAnimals] = useState([])
    const [employeeLocations, updateEmployeeLocations] = useState([])

    useEffect(() => {
        AnimalRepository.getAll()
        .then((data) => updateAnimals(data))
    }, [])

    useEffect(() => {
        LocationRepository.getEmployeeLocationsArray()
        .then((data) => updateEmployeeLocations(data))
    }, [])

    

    const matchingAnimals = animals.filter(animal => animal.locationId === location.id)
    const matchingEmployees = employeeLocations.filter(employeeLocation => employeeLocation.locationId === location.id)

    return (
        <article className="card location" style={{ width: `18rem` }}>
            <section className="card-body">
                <img alt="Kennel location icon" src={locationImage} className="icon--location" />
                <h5 className="card-title">
                    <Link className="card-link"
                        to={{
                            pathname: `/locations/${location.id}`,
                            state: { location: location }
                        }}>
                        {location.name}
                    </Link>
                </h5>
            </section>
            <section>
                Total Animals: {matchingAnimals.length}
            </section>
            <section>
                Total Employees: {matchingEmployees.length}
            </section>
        </article>
    )
}

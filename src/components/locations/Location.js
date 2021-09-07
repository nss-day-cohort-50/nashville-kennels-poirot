import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import AnimalRepository from "../../repositories/AnimalRepository";
import EmployeeRepository from "../../repositories/EmployeeRepository";
import locationImage from "./location.png"
import "./Location.css"
import LocationRepository from "../../repositories/LocationRepository";


export default ({location}) => {
    const [animals, updateAnimals] = useState([])
    const [employees, updateEmployees] = useState([])
    const [locations, updateLocations] = useState([])

    useEffect(() => {
        AnimalRepository.getAll()
        .then((data) => updateAnimals(data))
    }, [])

    useEffect(() => {
        EmployeeRepository.getAll()
        .then((data) => updateEmployees(data))
    }, [])

    useEffect(() => {
        LocationRepository.getAll()
        .then((data) => updateLocations(data))
    }, [])

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
                {
                    animals.map(
                        (animal) => {
                            const matchingAnimals = locations.filter(location => location.id === animal.locationId)
                            
                            return `${matchingAnimals.length} animals`
                    })
                }
            </section>
            <section>
                Total locations
            </section>
        </article>
    )
}

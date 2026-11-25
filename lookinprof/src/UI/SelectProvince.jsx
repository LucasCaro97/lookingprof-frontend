import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const SelectProvince = ({ onProvinciaChange }) => {
    const [provincias, setProvincias] = useState([]);
    const [selectedProvId, setSelectedProvId] = useState('');
    const [selectedProvName, setSelectedProvName] = useState('');
    const [cities, setCities] = useState([]);
    const [selectedCityId, setSelectedCityId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const provincesRes = await axios.get(`${API_URL}/provinces/get`);
                setProvincias(provincesRes.data || []);
            } catch (error) {
                console.error('Error al obtener las provincias:', error);
            }

            setCities([]);
        };

        fetchData();
    }, []);

    const handleProvinceChange = async (event) => {
        const newSelectedProvName = event.target.value;
        setSelectedProvName(newSelectedProvName);

        // Find the selected province ID
        const selectedProvince = provincias.find(prov => prov.nameProvince === newSelectedProvName);
        if (selectedProvince) {
            setSelectedProvId(selectedProvince.idProvince);
            if (onProvinciaChange) {
                onProvinciaChange(selectedProvince.idProvince, '');
            }
        } else {
            setSelectedProvId('');
            if (onProvinciaChange) {
                onProvinciaChange('', '');
            }
        }

        if (newSelectedProvName !== '' && selectedProvince) {
            try {
                const res = await axios.get(`${API_URL}/city/get`);
                const filteredCities = res.data.filter(city => city.idProvince === selectedProvince.idProvince);
                setCities(filteredCities || []);
            } catch (error) {
                console.error('Error al obtener las ciudades:', error);
            }
        } else {
            // If no province is selected, clear cities
            setCities([]);
        }

        setSelectedCityId(""); // Reset selected city
    };

    const handleCityChange = (event) => {
        const newSelectedCityId = event.target.value;
        setSelectedCityId(newSelectedCityId);
        if (onProvinciaChange) {
            // Pass both province ID and city ID to the parent component
            onProvinciaChange(selectedProvId, newSelectedCityId);
        }
    };

    return (
        <div className='flex flex-col gap-4'>
            <FormControl fullWidth>
                <InputLabel id="provincia-select-label">Provincias</InputLabel>
                <Select
                    labelId="provincia-select-label"
                    value={selectedProvName}
                    onChange={handleProvinceChange}
                    label="Provincias"
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {provincias.map((prov) => (
                        <MenuItem key={prov.idProvince} value={prov.nameProvince}>
                            {prov.nameProvince}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel id="city-select-label">Ciudades</InputLabel>
                <Select
                    labelId="city-select-label"
                    value={selectedCityId}
                    onChange={handleCityChange}
                    label="Ciudades"
                    disabled={cities.length === 0}
                >
                    <MenuItem value="">
                        <em>Seleccione una ciudad</em>
                    </MenuItem>
                    {cities.map((city) => (
                        <MenuItem key={city.idCity} value={city.idCity}>
                            {city.nameCity}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};

export default SelectProvince;

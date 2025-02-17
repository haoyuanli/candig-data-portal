import React, { useState, useEffect, useRef } from 'react';

import MainCard from 'ui-component/cards/MainCard';
import { Box, Button, FormControl, InputLabel, Input, NativeSelect, FormHelperText } from '@mui/material';
import { Grid } from '@material-ui/core';

import { useSelector } from 'react-redux';
import { MultiSelect } from 'react-multi-select-component';

import VariantsTable from 'ui-component/Tables/VariantsTable';
import { searchVariant, searchVariantSets, searchVariantByVariantSetIds, getReferenceSet } from 'store/api';
import { ListOfLongReferenceNames } from 'store/constant';
import LightCard from 'views/dashboard/Default/LightCard';
import DatasetIdSelect from 'views/dashboard/Default/datasetIdSelect';

// import { notify, NotificationAlert } from '../../utils/alert';
import { LoadingIndicator, usePromiseTracker, trackPromise } from 'ui-component/LoadingIndicator/LoadingIndicator';
import { SearchIndicator } from 'ui-component/LoadingIndicator/SearchIndicator';
import { Map, Description } from '@material-ui/icons';
import 'assets/css/VariantsSearch.css';

function VariantsSearch() {
    const [isLoading, setLoading] = useState(true);
    const events = useSelector((state) => state);
    let { datasetId } = events.customization.update.datasetId;
    const [rowData, setRowData] = useState([]);
    const [displayVariantsTable, setDisplayVariantsTable] = useState(false);
    const notifyEl = useRef(null);
    const [variantSet, setVariantSets] = useState('');
    const [referenceSetName, setReferenceSetName] = useState('');
    const { promiseInProgress } = usePromiseTracker();
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState([]);
    const [variantSetIds, setVariantSetIds] = useState([]);

    /*
  Fetches reference set Name and sets referenceSetName
  * @param {string}... referenceSetId
  */
    function settingReferenceSetName(referenceSetId) {
        getReferenceSet(referenceSetId)
            .then((data) => {
                setReferenceSetName(data.results.name);
            })
            .catch(() => {
                setReferenceSetName('Not Available');
            });
    }

    /*
  Build the dropdown for chromosome
  * @param {None}
  * Return a list of options with chromosome
  */
    function chrSelectBuilder() {
        const refNameList = [];

        ListOfLongReferenceNames.forEach((refName) => {
            refNameList.push(
                <option key={refName} value={refName}>
                    {refName}
                </option>
            );
        });
        return refNameList;
    }

    useEffect(() => {
        setLoading(false);
        setDisplayVariantsTable(false);
        // Check for variant and reference name set on datasetId changes
        datasetId = events.customization.update.datasetId;
        if (events.customization.update.datasetId) {
            trackPromise(
                searchVariantSets(datasetId)
                    .then((data) => {
                        setVariantSets(data.results.total);
                        setSelected([]);
                        const dropdownOptions = [];
                        dropdownOptions.length = 0;
                        data.results.variantSets.forEach((variant) => {
                            dropdownOptions.push({ label: variant.name, value: variant.id });
                        });
                        setOptions(dropdownOptions);
                        setSelected(dropdownOptions);
                        settingReferenceSetName(data.results.variantSets[0].referenceSetId);
                    })
                    .catch(() => {
                        setVariantSets('Not Available');
                        setReferenceSetName('Not Available');
                        // notify(
                        //   notifyEl,
                        //   'No variants or reference set names were found.',
                        //   'warning',
                        // );
                    })
            );
        }
    }, [datasetId, events.customization.update.datasetId]);

    const formHandler = (e) => {
        e.preventDefault(); // Prevent form submission
        setDisplayVariantsTable(false);
        if (selected) {
            selected.forEach((variantSetId) => {
                variantSetIds.push(variantSetId.value);
            });
            // searchVariant(e.target.start.value, e.target.end.value, e.target.chromosome.value, variantSetIds) query /variants/search
            trackPromise(
                searchVariantByVariantSetIds(e.target.start.value, e.target.end.value, e.target.chromosome.value, variantSetIds)
                    .then((data) => {
                        setDisplayVariantsTable(true);
                        setRowData(data.results.variants);
                    })
                    .catch(() => {
                        setRowData([]);
                        setDisplayVariantsTable(false);
                        //           notify(
                        //             notifyEl,
                        //             'No variants were found.',
                        //             'warning',
                        //           );
                    }),
                'table'
            );
            setVariantSetIds([]);
        } else {
            searchVariant(datasetId, e.target.start.value, e.target.end.value, e.target.chromosome.value)
                .then((data) => {
                    setRowData(data.results.variants);
                    setDisplayVariantsTable(true);
                })
                .catch(() => {
                    setDisplayVariantsTable(false);
                    // notify(
                    //   notifyEl,
                    //   'No variants were found.',
                    //   'warning',
                    // );
                });
        }
    };

    return (
        <>
            <MainCard title="Variants Search" sx={{ minHeight: 830, position: 'relative' }}>
                <DatasetIdSelect />
                <Grid container direction="column" className="content">
                    {/* <NotificationAlert ref={notifyEl} /> */}
                    <Grid container direction="row" justifyContent="center" spacing={2} p={2}>
                        <Grid item sm={12} xs={12} md={4} lg={4}>
                            {promiseInProgress === true ? (
                                <LoadingIndicator />
                            ) : (
                                <LightCard
                                    isLoading={isLoading}
                                    header="Reference Genome"
                                    value={referenceSetName}
                                    icon={<Map fontSize="inherit" />}
                                />
                            )}
                        </Grid>
                        <Grid item sm={12} xs={12} md={4} lg={4}>
                            {promiseInProgress === true ? (
                                <LoadingIndicator />
                            ) : (
                                <LightCard
                                    isLoading={isLoading}
                                    header="VariantSets/VCFs"
                                    value={variantSet}
                                    icon={<Description fontSize="inherit" />}
                                />
                            )}
                        </Grid>
                    </Grid>

                    <form onSubmit={formHandler} style={{ justifyContent: 'center' }}>
                        <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2} p={2}>
                            <Grid item>
                                {options.length > 0 && (
                                    <FormControl>
                                        <Grid container direction="row" alignItems="center">
                                            <Box mr={2}>
                                                <p>Variant Set</p>
                                            </Box>
                                            <MultiSelect // Width set in CSS
                                                options={options}
                                                value={selected}
                                                onChange={setSelected}
                                                labelledBy="Variant Set"
                                            />
                                        </Grid>
                                    </FormControl>
                                )}
                            </Grid>
                            <Grid item sx={{ minWidth: 150 }}>
                                <FormControl fullWidth variant="standard">
                                    <InputLabel id="chr-label">Chromosome</InputLabel>
                                    <NativeSelect labelId="chr-label" required id="chromosome">
                                        {chrSelectBuilder()}
                                    </NativeSelect>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl>
                                    <InputLabel for="start">Start</InputLabel>
                                    <Input required type="number" id="start" />
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl>
                                    <InputLabel for="end">End</InputLabel>
                                    <Input required type="number" id="end" />
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <FormControl>
                                    <Button type="submit" variant="contained">
                                        Search
                                    </Button>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </form>

                    {displayVariantsTable ? (
                        <VariantsTable rowData={rowData} datasetId={events.customization.update.datasetId} />
                    ) : (
                        <SearchIndicator area="table" />
                    )}
                </Grid>
            </MainCard>
        </>
    );
}

export default VariantsSearch;

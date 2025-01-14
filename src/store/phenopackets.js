import React from 'react';
import { Button } from '@material-ui/core';

function moreInfoButton(params) {
    return (
        <strong>
            <Button
                onClick={() => {
                    console.log(params.row.id);
                }}
            >
                More Info
            </Button>
        </strong>
    );
}

export const mainColumns = [
    {
        field: 'id',
        headerName: 'ID',
        width: 130
    },
    {
        field: 'more_info',
        headerName: 'Info',
        width: 100,
        sortable: false,
        headerAlign: 'center',
        align: 'center',
        renderCell: moreInfoButton,
        disableClickEventBubbling: true
    },
    {
        field: 'ethnicity',
        headerName: 'Ethnicity',
        width: 180
    },
    {
        field: 'sex',
        headerName: 'Sex',
        width: 150
    },
    {
        field: 'height',
        headerName: 'Height',
        width: 130,
        hide: true
    },
    {
        field: 'weight',
        headerName: 'Weight',
        width: 130,
        hide: true
    },
    {
        field: 'abo_type',
        headerName: 'Blood Type',
        width: 170,
        hide: true
    },
    {
        field: 'education',
        headerName: 'Education',
        width: 200,
        hide: true
    },
    {
        field: 'household',
        headerName: 'Household',
        width: 170,
        hide: true
    },
    {
        field: 'pregnancy',
        headerName: 'Pregnancy',
        width: 170,
        hide: true
    },
    {
        field: 'employment',
        headerName: 'Employment',
        width: 250,
        hide: true
    },
    {
        field: 'asymptomatic',
        headerName: 'Asymptomatic',
        width: 170,
        hide: true
    },
    {
        field: 'covid19_test',
        headerName: 'Covid19 Test',
        width: 170,
        hide: true
    },
    {
        field: 'hospitalized',
        headerName: 'Hospitalized',
        width: 170,
        hide: true
    },
    {
        field: 'birth_country',
        headerName: 'Birth Country',
        width: 200,
        hide: true
    },
    {
        field: 'host_hospital',
        headerName: 'Host Hospital',
        width: 170,
        hide: true
    },
    {
        field: 'residence_type',
        headerName: 'Residence Type',
        width: 200,
        hide: true
    },
    {
        field: 'enrollment_date',
        headerName: 'Enrollment Date',
        width: 190,
        hide: true
    },
    {
        field: 'covid19_test_date',
        headerName: 'Covid19 Test Date',
        width: 220,
        hide: true
    },
    {
        field: 'covid19_diagnosis_date',
        headerName: 'Covid19 Diagnosis Date',
        width: 240,
        hide: true
    }
];

export const phenotypicFeatureColumns = [
    {
        field: 'id',
        headerName: 'id',
        width: 150
    },
    {
        field: 'label',
        headerName: 'Label',
        width: 180
    },
    {
        field: 'description',
        headerName: 'Description',
        width: 180
    },
    {
        field: 'negated',
        headerName: 'Negated',
        width: 150
    },
    {
        field: 'datatype',
        headerName: 'Datatype',
        width: 140
    }
];

export const diseasesColumns = [
    {
        field: 'id',
        headerName: 'id',
        width: 100
    },
    {
        field: 'label',
        headerName: 'Disease Label',
        width: 190
    },
    {
        field: 'datatype',
        headerName: 'Datatype',
        width: 150
    },
    {
        field: 'comorbidities_group',
        headerName: 'Comorbidities Group',
        width: 240
    },
    {
        field: 'created',
        headerName: 'Created',
        width: 160,
        hide: true
    },
    {
        field: 'updated',
        headerName: 'Updated',
        width: 200,
        hide: true
    }
];

export const resourcesColumns = [
    {
        field: 'id',
        headerName: 'id',
        width: 150
    },
    {
        field: 'name',
        headerName: 'Name',
        width: 250
    },
    {
        field: 'namespace_prefix',
        headerName: 'Namespace Prefix',
        width: 200
    },
    {
        field: 'url',
        headerName: 'URL',
        width: 250,
        hide: true
    },
    {
        field: 'version',
        headerName: 'Version',
        width: 140
    },
    {
        field: 'iri_prefix',
        headerName: 'IRI Prefix',
        width: 250,
        hide: true
    },
    {
        field: 'created',
        headerName: 'Created',
        width: 250,
        hide: true
    },
    {
        field: 'updated',
        headerName: 'Updated',
        width: 250,
        hide: true
    }
];

/**
 * @param {*} dataObject
 * @returns an object representing one row for the main table containing subject information.
 */
export const processPhenopacketMainData = (dataObject) => {
    const row = {};
    row.id = dataObject.id;
    row.ethnicity = dataObject.subject.ethnicity;
    row.sex = dataObject.subject.sex;
    row.height = dataObject.subject.extra_properties.height;
    row.weight = dataObject.subject.extra_properties.weight;
    row.abo_type = dataObject.subject.extra_properties.abo_type;
    row.education = dataObject.subject.extra_properties.education;
    row.household = dataObject.subject.extra_properties.household;
    row.pregnancy = dataObject.subject.extra_properties.pregnancy;
    row.employment = dataObject.subject.extra_properties.employment;
    row.asymptomatic = dataObject.subject.extra_properties.asymptomatic;
    row.covid19_test = dataObject.subject.extra_properties.covid19_test;
    row.hospitalized = dataObject.subject.extra_properties.hospitalized;
    row.birth_country = dataObject.subject.extra_properties.birth_country;
    row.host_hospital = dataObject.subject.extra_properties.host_hospital;
    row.residence_type = dataObject.subject.extra_properties.residence_type;
    row.enrollment_date = dataObject.subject.extra_properties.enrollment_date;
    row.covid19_test_date = dataObject.subject.extra_properties.covid19_test_date;
    row.covid19_diagnosis_date = dataObject.subject.extra_properties.covid19_diagnosis_date;
    row.date_of_birth = dataObject.subject.date_of_birth;

    return row;
};

/**
 * @param {*} dataObject
 * @returns anobject representing one row for the Phenotypic Features
 */
export const processPhenotypicFeaturesData = (dataObject) => {
    const rows = [];

    // eslint-disable-next-line camelcase
    dataObject.phenotypic_features.forEach((phenotypic_features) => {
        const row = {};

        row.id = phenotypic_features.type.id;
        row.label = phenotypic_features.type.label;
        row.description = phenotypic_features.description;
        row.negated = phenotypic_features.negated;
        row.datatype = phenotypic_features.extra_properties.datatype;

        rows.push(row);
    });

    return rows;
};

/**
 * @param {*} dataObject
 * @returns an object representing one row for the diseases
 */
export const processDiseaseData = (dataObject) => {
    const rows = [];

    // eslint-disable-next-line camelcase
    dataObject.diseases.forEach((diseases) => {
        const row = {};

        row.id = diseases.id;
        row.label = diseases.term.label;
        row.datatype = diseases.extra_properties.datatype;
        row.comorbidities_group = diseases.extra_properties.comorbidities_group;
        row.created = diseases.created;
        row.updated = diseases.updated;

        rows.push(row);
    });

    return rows;
};

/**
 * @param {*} dataObject
 * @returns an object representing one row for the resources
 */
export const processResourcesData = (dataObject) => {
    const rows = [];

    // eslint-disable-next-line camelcase
    dataObject.meta_data.resources.forEach((resources) => {
        const row = {};

        row.id = resources.id;
        row.name = resources.name;
        row.namespace_prefix = resources.namespace_prefix;
        row.url = resources.url;
        row.version = resources.version;
        row.iri_prefix = resources.iri_prefix;
        row.created = resources.created;
        row.updated = resources.updated;

        rows.push(row);
    });

    return rows;
};

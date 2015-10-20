var ageGroupList = [
    {"age_group_id": 38, "age_group": "adults"},
    {"age_group_id": 36, "age_group": "children"}
];

function getAgeGroupSelected() {
    return _.find(ageGroupList, function (d) {
        return d.age_group == ageGroupMenu.property("value");
    });
}

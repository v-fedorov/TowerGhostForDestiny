tgd.ArmorSelection = function(groups) {
    var self = this;

    self.groups = groups;

    self.armorGroups = ko.observableArray();

    self.armorGroups(_.map(groups, function(items, bucketType) {
        return new tgd.armorGroup(bucketType, items, self.armorGroups);
    }));

    self.selectedItems = ko.computed(function() {
        return _.map(self.armorGroups(), function(group) {
            return group.selectedItem();
        });
    });
    self.combinedStatPoints = ko.computed(function() {
        return tgd.sum(_.map(self.selectedItems(), function(item) {
            return item.getValue("MaxLightCSP");
        }));
    });
    self.currentStats = ko.computed(function() {
        return tgd.joinStats(self.selectedItems());
    });
    self.statTiers = ko.computed(function() {
        return _.map(self.currentStats(), function(stat, name) {
            return "<strong>" + name.substring(0, 3) + "</strong> T" + Math.floor(stat / tgd.DestinySkillTier);
        }).join("/");
    });
    self.statValues = ko.computed(function() {
        return _.map(self.currentStats(), function(stat, name) {
            return stat;
        }).join("/");
    });
    self.projectedLightLevel = ko.computed(function() {
        return tgd.DestinyLightCap;
    });
    self.currentLightLevel = ko.computed(function() {
        return 10;
    });
}

tgd.armorGroup = function(bucketType, items, groups) {
    var self = this;

    self.bucketType = bucketType;

    var selectedIndex = 0;

    self.selectedItem = ko.observable();

    self.items = _.map(items, function(item, index) {
        return new tgd.armorItem(item, self.selectedItem, groups);
    });

    self.selectedItem(self.items[selectedIndex]);
}

tgd.armorItem = function(item, selectedItem, groups) {
    var self = this
    _.extend(self, item);
    var isSelected = ko.computed(function() {
        return self == selectedItem();
    });
    var isDisabled = ko.computed(function() {
        //first pass be based on csp, second pass will be based on sum of tiers
        var totalCSP = tgd.sum(_.map(groups(), function(group) {
            return group.bucketType == self.bucketType ? 0 : group.selectedItem().getValue("MaxLightCSP");
        })) + self.getValue("MaxLightCSP");
        return tgd.maxTierPointsPossible >= totalCSP;
    });
    self.css = ko.computed(function() {
        return (isSelected() ? "selected" : "not-selected") + " " + (isDisabled() ? "disabled" : "not-disabled");
    });
    this.select = function() {
        if (isDisabled()) {
            BootstrapDialog.alert("This item cannot be selected to maintain the max tier");
        } else {
            selectedItem(self);
        }
    }
}
/**
 * @fileoverview added by tsickle
 * Generated from: lib/base-chart.directive.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, EventEmitter, Input, Output, } from '@angular/core';
import { getColors } from './get-colors';
import { ThemeService } from './theme.service';
import { cloneDeep } from 'lodash-es';
import { Chart, pluginService } from 'chart.js';
/**
 * @record
 */
function OldState() { }
if (false) {
    /** @type {?} */
    OldState.prototype.dataExists;
    /** @type {?} */
    OldState.prototype.dataLength;
    /** @type {?} */
    OldState.prototype.datasetsExists;
    /** @type {?} */
    OldState.prototype.datasetsLength;
    /** @type {?} */
    OldState.prototype.datasetsDataObjects;
    /** @type {?} */
    OldState.prototype.datasetsDataLengths;
    /** @type {?} */
    OldState.prototype.colorsExists;
    /** @type {?} */
    OldState.prototype.colors;
    /** @type {?} */
    OldState.prototype.labelsExist;
    /** @type {?} */
    OldState.prototype.labels;
    /** @type {?} */
    OldState.prototype.legendExists;
    /** @type {?} */
    OldState.prototype.legend;
}
/** @enum {number} */
const UpdateType = {
    Default: 0,
    Update: 1,
    Refresh: 2,
};
UpdateType[UpdateType.Default] = 'Default';
UpdateType[UpdateType.Update] = 'Update';
UpdateType[UpdateType.Refresh] = 'Refresh';
export class BaseChartDirective {
    /**
     * @param {?} element
     * @param {?} themeService
     */
    constructor(element, themeService) {
        this.element = element;
        this.themeService = themeService;
        this.options = {};
        this.chartClick = new EventEmitter();
        this.chartHover = new EventEmitter();
        this.old = {
            dataExists: false,
            dataLength: 0,
            datasetsExists: false,
            datasetsLength: 0,
            datasetsDataObjects: [],
            datasetsDataLengths: [],
            colorsExists: false,
            colors: [],
            labelsExist: false,
            labels: [],
            legendExists: false,
            legend: {},
        };
        this.subs = [];
    }
    /**
     * Register a plugin.
     * @param {?} plugin
     * @return {?}
     */
    static registerPlugin(plugin) {
        pluginService.register(plugin);
    }
    /**
     * @param {?} plugin
     * @return {?}
     */
    static unregisterPlugin(plugin) {
        pluginService.unregister(plugin);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.ctx = this.element.nativeElement.getContext('2d');
        this.refresh();
        this.subs.push(this.themeService.colorschemesOptions.subscribe((/**
         * @param {?} r
         * @return {?}
         */
        r => this.themeChanged(r))));
    }
    /**
     * @private
     * @param {?} options
     * @return {?}
     */
    themeChanged(options) {
        this.refresh();
    }
    /**
     * @return {?}
     */
    ngDoCheck() {
        if (!this.chart) {
            return;
        }
        /** @type {?} */
        let updateRequired = UpdateType.Default;
        /** @type {?} */
        const wantUpdate = (/**
         * @param {?} x
         * @return {?}
         */
        (x) => {
            updateRequired = x > updateRequired ? x : updateRequired;
        });
        if (!!this.data !== this.old.dataExists) {
            this.propagateDataToDatasets(this.data);
            this.old.dataExists = !!this.data;
            wantUpdate(UpdateType.Update);
        }
        if (this.data && this.data.length !== this.old.dataLength) {
            this.old.dataLength = this.data && this.data.length || 0;
            wantUpdate(UpdateType.Update);
        }
        if (!!this.datasets !== this.old.datasetsExists) {
            this.old.datasetsExists = !!this.datasets;
            wantUpdate(UpdateType.Update);
        }
        if (this.datasets && this.datasets.length !== this.old.datasetsLength) {
            this.old.datasetsLength = this.datasets && this.datasets.length || 0;
            wantUpdate(UpdateType.Update);
        }
        if (this.datasets && this.datasets.filter((/**
         * @param {?} x
         * @param {?} i
         * @return {?}
         */
        (x, i) => x.data !== this.old.datasetsDataObjects[i])).length) {
            this.old.datasetsDataObjects = this.datasets.map((/**
             * @param {?} x
             * @return {?}
             */
            x => x.data));
            wantUpdate(UpdateType.Update);
        }
        if (this.datasets && this.datasets.filter((/**
         * @param {?} x
         * @param {?} i
         * @return {?}
         */
        (x, i) => x.data.length !== this.old.datasetsDataLengths[i])).length) {
            this.old.datasetsDataLengths = this.datasets.map((/**
             * @param {?} x
             * @return {?}
             */
            x => x.data.length));
            wantUpdate(UpdateType.Update);
        }
        if (!!this.colors !== this.old.colorsExists) {
            this.old.colorsExists = !!this.colors;
            this.updateColors();
            wantUpdate(UpdateType.Update);
        }
        // This smells of inefficiency, might need to revisit this
        if (this.colors && this.colors.filter((/**
         * @param {?} x
         * @param {?} i
         * @return {?}
         */
        (x, i) => !this.colorsEqual(x, this.old.colors[i]))).length) {
            this.old.colors = this.colors.map((/**
             * @param {?} x
             * @return {?}
             */
            x => this.copyColor(x)));
            this.updateColors();
            wantUpdate(UpdateType.Update);
        }
        if (!!this.labels !== this.old.labelsExist) {
            this.old.labelsExist = !!this.labels;
            wantUpdate(UpdateType.Update);
        }
        if (this.labels && this.labels.filter((/**
         * @param {?} x
         * @param {?} i
         * @return {?}
         */
        (x, i) => !this.labelsEqual(x, this.old.labels[i]))).length) {
            this.old.labels = this.labels.map((/**
             * @param {?} x
             * @return {?}
             */
            x => this.copyLabel(x)));
            wantUpdate(UpdateType.Update);
        }
        if (!!this.options.legend !== this.old.legendExists) {
            this.old.legendExists = !!this.options.legend;
            wantUpdate(UpdateType.Refresh);
        }
        if (this.options.legend && this.options.legend.position !== this.old.legend.position) {
            this.old.legend.position = this.options.legend.position;
            wantUpdate(UpdateType.Refresh);
        }
        switch ((/** @type {?} */ (updateRequired))) {
            case UpdateType.Default:
                break;
            case UpdateType.Update:
                this.update();
                break;
            case UpdateType.Refresh:
                this.refresh();
                break;
        }
    }
    /**
     * @param {?} a
     * @return {?}
     */
    copyLabel(a) {
        if (Array.isArray(a)) {
            return [...a];
        }
        return a;
    }
    /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    labelsEqual(a, b) {
        return Array.isArray(a) === Array.isArray(b)
            && (Array.isArray(a) || a === b)
            && (!Array.isArray(a) || a.length === b.length)
            && (!Array.isArray(a) || a.filter((/**
             * @param {?} x
             * @param {?} i
             * @return {?}
             */
            (x, i) => x !== b[i])).length === 0);
    }
    /**
     * @param {?} a
     * @return {?}
     */
    copyColor(a) {
        return {
            backgroundColor: a.backgroundColor,
            borderWidth: a.borderWidth,
            borderColor: a.borderColor,
            borderCapStyle: a.borderCapStyle,
            borderDash: a.borderDash,
            borderDashOffset: a.borderDashOffset,
            borderJoinStyle: a.borderJoinStyle,
            pointBorderColor: a.pointBorderColor,
            pointBackgroundColor: a.pointBackgroundColor,
            pointBorderWidth: a.pointBorderWidth,
            pointRadius: a.pointRadius,
            pointHoverRadius: a.pointHoverRadius,
            pointHitRadius: a.pointHitRadius,
            pointHoverBackgroundColor: a.pointHoverBackgroundColor,
            pointHoverBorderColor: a.pointHoverBorderColor,
            pointHoverBorderWidth: a.pointHoverBorderWidth,
            pointStyle: a.pointStyle,
            hoverBackgroundColor: a.hoverBackgroundColor,
            hoverBorderColor: a.hoverBorderColor,
            hoverBorderWidth: a.hoverBorderWidth,
        };
    }
    /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    colorsEqual(a, b) {
        if (!a !== !b) {
            return false;
        }
        return !a ||
            (a.backgroundColor === b.backgroundColor)
                && (a.borderWidth === b.borderWidth)
                && (a.borderColor === b.borderColor)
                && (a.borderCapStyle === b.borderCapStyle)
                && (a.borderDash === b.borderDash)
                && (a.borderDashOffset === b.borderDashOffset)
                && (a.borderJoinStyle === b.borderJoinStyle)
                && (a.pointBorderColor === b.pointBorderColor)
                && (a.pointBackgroundColor === b.pointBackgroundColor)
                && (a.pointBorderWidth === b.pointBorderWidth)
                && (a.pointRadius === b.pointRadius)
                && (a.pointHoverRadius === b.pointHoverRadius)
                && (a.pointHitRadius === b.pointHitRadius)
                && (a.pointHoverBackgroundColor === b.pointHoverBackgroundColor)
                && (a.pointHoverBorderColor === b.pointHoverBorderColor)
                && (a.pointHoverBorderWidth === b.pointHoverBorderWidth)
                && (a.pointStyle === b.pointStyle)
                && (a.hoverBackgroundColor === b.hoverBackgroundColor)
                && (a.hoverBorderColor === b.hoverBorderColor)
                && (a.hoverBorderWidth === b.hoverBorderWidth);
    }
    /**
     * @return {?}
     */
    updateColors() {
        this.datasets.forEach((/**
         * @param {?} elm
         * @param {?} index
         * @return {?}
         */
        (elm, index) => {
            if (this.colors && this.colors[index]) {
                Object.assign(elm, this.colors[index]);
            }
            else {
                Object.assign(elm, getColors(this.chartType, index, elm.data.length), Object.assign({}, elm));
            }
        }));
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        /** @type {?} */
        let updateRequired = UpdateType.Default;
        /** @type {?} */
        const wantUpdate = (/**
         * @param {?} x
         * @return {?}
         */
        (x) => {
            updateRequired = x > updateRequired ? x : updateRequired;
        });
        // Check if the changes are in the data or datasets or labels or legend
        if (changes.hasOwnProperty('data') && changes.data.currentValue) {
            this.propagateDataToDatasets(changes.data.currentValue);
            wantUpdate(UpdateType.Update);
        }
        if (changes.hasOwnProperty('datasets') && changes.datasets.currentValue) {
            this.propagateDatasetsToData(changes.datasets.currentValue);
            wantUpdate(UpdateType.Update);
        }
        if (changes.hasOwnProperty('labels')) {
            if (this.chart) {
                this.chart.data.labels = changes.labels.currentValue;
            }
            wantUpdate(UpdateType.Update);
        }
        if (changes.hasOwnProperty('legend')) {
            if (this.chart) {
                this.chart.config.options.legend.display = changes.legend.currentValue;
                this.chart.generateLegend();
            }
            wantUpdate(UpdateType.Update);
        }
        if (changes.hasOwnProperty('options')) {
            wantUpdate(UpdateType.Refresh);
        }
        switch ((/** @type {?} */ (updateRequired))) {
            case UpdateType.Update:
                this.update();
                break;
            case UpdateType.Refresh:
            case UpdateType.Default:
                this.refresh();
                break;
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = void 0;
        }
        this.subs.forEach((/**
         * @param {?} x
         * @return {?}
         */
        x => x.unsubscribe()));
    }
    /**
     * @param {?=} duration
     * @return {?}
     */
    update(duration) {
        if (this.chart) {
            return this.chart.update(duration);
        }
    }
    /**
     * @param {?} index
     * @param {?} hidden
     * @return {?}
     */
    hideDataset(index, hidden) {
        this.chart.getDatasetMeta(index).hidden = hidden;
        this.chart.update();
    }
    /**
     * @param {?} index
     * @return {?}
     */
    isDatasetHidden(index) {
        return this.chart.getDatasetMeta(index).hidden;
    }
    /**
     * @return {?}
     */
    toBase64Image() {
        return this.chart.toBase64Image();
    }
    /**
     * @return {?}
     */
    getChartConfiguration() {
        /** @type {?} */
        const datasets = this.getDatasets();
        /** @type {?} */
        const options = Object.assign({}, this.options);
        if (this.legend === false) {
            options.legend = { display: false };
        }
        // hook for onHover and onClick events
        options.hover = options.hover || {};
        if (!options.hover.onHover) {
            options.hover.onHover = (/**
             * @param {?} event
             * @param {?} active
             * @return {?}
             */
            (event, active) => {
                if (active && !active.length) {
                    return;
                }
                this.chartHover.emit({ event, active });
            });
        }
        if (!options.onClick) {
            options.onClick = (/**
             * @param {?=} event
             * @param {?=} active
             * @return {?}
             */
            (event, active) => {
                this.chartClick.emit({ event, active });
            });
        }
        /** @type {?} */
        const mergedOptions = this.smartMerge(options, this.themeService.getColorschemesOptions());
        return {
            type: this.chartType,
            data: {
                labels: this.labels || [],
                datasets
            },
            plugins: this.plugins,
            options: mergedOptions,
        };
    }
    /**
     * @param {?} ctx
     * @return {?}
     */
    getChartBuilder(ctx /*, data:any[], options:any*/) {
        /** @type {?} */
        const chartConfig = this.getChartConfiguration();
        return new Chart(ctx, chartConfig);
    }
    /**
     * @param {?} options
     * @param {?} overrides
     * @param {?=} level
     * @return {?}
     */
    smartMerge(options, overrides, level = 0) {
        if (level === 0) {
            options = cloneDeep(options);
        }
        /** @type {?} */
        const keysToUpdate = Object.keys(overrides);
        keysToUpdate.forEach((/**
         * @param {?} key
         * @return {?}
         */
        key => {
            if (Array.isArray(overrides[key])) {
                /** @type {?} */
                const arrayElements = options[key];
                if (arrayElements) {
                    arrayElements.forEach((/**
                     * @param {?} r
                     * @return {?}
                     */
                    r => {
                        this.smartMerge(r, overrides[key][0], level + 1);
                    }));
                }
            }
            else if (typeof (overrides[key]) === 'object') {
                if (!(key in options)) {
                    options[key] = {};
                }
                this.smartMerge(options[key], overrides[key], level + 1);
            }
            else {
                options[key] = overrides[key];
            }
        }));
        if (level === 0) {
            return options;
        }
    }
    /**
     * @private
     * @param {?} label
     * @return {?}
     */
    isMultiLineLabel(label) {
        return Array.isArray(label);
    }
    /**
     * @private
     * @param {?} label
     * @return {?}
     */
    joinLabel(label) {
        if (!label) {
            return null;
        }
        if (this.isMultiLineLabel(label)) {
            return label.join(' ');
        }
        else {
            return label;
        }
    }
    /**
     * @private
     * @param {?} datasets
     * @return {?}
     */
    propagateDatasetsToData(datasets) {
        this.data = this.datasets.map((/**
         * @param {?} r
         * @return {?}
         */
        r => r.data));
        if (this.chart) {
            this.chart.data.datasets = datasets;
        }
        this.updateColors();
    }
    /**
     * @private
     * @param {?} newDataValues
     * @return {?}
     */
    propagateDataToDatasets(newDataValues) {
        if (this.isMultiDataSet(newDataValues)) {
            if (this.datasets && newDataValues.length === this.datasets.length) {
                this.datasets.forEach((/**
                 * @param {?} dataset
                 * @param {?} i
                 * @return {?}
                 */
                (dataset, i) => {
                    dataset.data = newDataValues[i];
                }));
            }
            else {
                this.datasets = newDataValues.map((/**
                 * @param {?} data
                 * @param {?} index
                 * @return {?}
                 */
                (data, index) => {
                    return { data, label: this.joinLabel(this.labels[index]) || `Label ${index}` };
                }));
                if (this.chart) {
                    this.chart.data.datasets = this.datasets;
                }
            }
        }
        else {
            if (!this.datasets) {
                this.datasets = [{ data: newDataValues }];
                if (this.chart) {
                    this.chart.data.datasets = this.datasets;
                }
            }
            else {
                if (!this.datasets[0]) {
                    this.datasets[0] = {};
                }
                this.datasets[0].data = newDataValues;
                this.datasets.splice(1); // Remove all elements but the first
            }
        }
        this.updateColors();
    }
    /**
     * @private
     * @param {?} data
     * @return {?}
     */
    isMultiDataSet(data) {
        return Array.isArray(data[0]);
    }
    /**
     * @private
     * @return {?}
     */
    getDatasets() {
        if (!this.datasets && !this.data) {
            throw new Error(`ng-charts configuration error, data or datasets field are required to render chart ${this.chartType}`);
        }
        // If `datasets` is defined, use it over the `data` property.
        if (this.datasets) {
            this.propagateDatasetsToData(this.datasets);
            return this.datasets;
        }
        if (this.data) {
            this.propagateDataToDatasets(this.data);
            return this.datasets;
        }
    }
    /**
     * @private
     * @return {?}
     */
    refresh() {
        // if (this.options && this.options.responsive) {
        //   setTimeout(() => this.refresh(), 50);
        // }
        // todo: remove this line, it is producing flickering
        if (this.chart) {
            this.chart.destroy();
            this.chart = void 0;
        }
        if (this.ctx) {
            this.chart = this.getChartBuilder(this.ctx /*, data, this.options*/);
        }
    }
}
BaseChartDirective.decorators = [
    { type: Directive, args: [{
                // tslint:disable-next-line:directive-selector
                selector: 'canvas[baseChart]',
                exportAs: 'base-chart'
            },] }
];
/** @nocollapse */
BaseChartDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: ThemeService }
];
BaseChartDirective.propDecorators = {
    data: [{ type: Input }],
    datasets: [{ type: Input }],
    labels: [{ type: Input }],
    options: [{ type: Input }],
    chartType: [{ type: Input }],
    colors: [{ type: Input }],
    legend: [{ type: Input }],
    plugins: [{ type: Input }],
    chartClick: [{ type: Output }],
    chartHover: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    BaseChartDirective.prototype.data;
    /** @type {?} */
    BaseChartDirective.prototype.datasets;
    /** @type {?} */
    BaseChartDirective.prototype.labels;
    /** @type {?} */
    BaseChartDirective.prototype.options;
    /** @type {?} */
    BaseChartDirective.prototype.chartType;
    /** @type {?} */
    BaseChartDirective.prototype.colors;
    /** @type {?} */
    BaseChartDirective.prototype.legend;
    /** @type {?} */
    BaseChartDirective.prototype.plugins;
    /** @type {?} */
    BaseChartDirective.prototype.chartClick;
    /** @type {?} */
    BaseChartDirective.prototype.chartHover;
    /** @type {?} */
    BaseChartDirective.prototype.ctx;
    /** @type {?} */
    BaseChartDirective.prototype.chart;
    /**
     * @type {?}
     * @private
     */
    BaseChartDirective.prototype.old;
    /**
     * @type {?}
     * @private
     */
    BaseChartDirective.prototype.subs;
    /**
     * @type {?}
     * @private
     */
    BaseChartDirective.prototype.element;
    /**
     * @type {?}
     * @private
     */
    BaseChartDirective.prototype.themeService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1jaGFydC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZzItY2hhcnRzL3NyYy9saWIvYmFzZS1jaGFydC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBRUwsU0FBUyxFQUVULFVBQVUsRUFDVixZQUFZLEVBQ1osS0FBSyxFQUlMLE1BQU0sR0FFUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRXpDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUUvQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3RDLE9BQU8sRUFDTCxLQUFLLEVBT0wsYUFBYSxFQUNkLE1BQU0sVUFBVSxDQUFDOzs7O0FBYWxCLHVCQWVDOzs7SUFkQyw4QkFBb0I7O0lBQ3BCLDhCQUFtQjs7SUFDbkIsa0NBQXdCOztJQUN4QixrQ0FBdUI7O0lBQ3ZCLHVDQUEyQjs7SUFDM0IsdUNBQThCOztJQUM5QixnQ0FBc0I7O0lBQ3RCLDBCQUFnQjs7SUFDaEIsK0JBQXFCOztJQUNyQiwwQkFBZ0I7O0lBQ2hCLGdDQUFzQjs7SUFDdEIsMEJBRUU7OztBQUdKLE1BQUssVUFBVTtJQUNiLE9BQU8sR0FBQTtJQUNQLE1BQU0sR0FBQTtJQUNOLE9BQU8sR0FBQTtFQUNSOzs7O0FBT0QsTUFBTSxPQUFPLGtCQUFrQjs7Ozs7SUE0QzdCLFlBQ1UsT0FBbUIsRUFDbkIsWUFBMEI7UUFEMUIsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUNuQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQTFDcEIsWUFBTyxHQUFpQixFQUFFLENBQUM7UUFNMUIsZUFBVSxHQUF3RCxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3JGLGVBQVUsR0FBc0QsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUs1RixRQUFHLEdB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RSxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztZQUVyRSxVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQy9CO1FBRUQsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTTs7Ozs7UUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sRUFBRTtZQUN0RyxJQUFJLENBQUMsR0FBRyxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRzs7OztZQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBQyxDQUFDO1lBRTlELFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDL0I7UUFFRCxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNOzs7OztRQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sRUFBRTtZQUM3RyxJQUFJLENBQUMsR0FBRyxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRzs7OztZQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUMsQ0FBQztZQUVyRSxVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQy9CO1FBRUQsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRTtZQUMzQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUV0QyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFFcEIsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMvQjtRQUVELDBEQUEwRDtRQUMxRCxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNOzs7OztRQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxFQUFFO1lBQ2hHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRzs7OztZQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDO1lBRTFELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUVwQixVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQy9CO1FBRUQsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRTtZQUMxQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUVyQyxVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQy9CO1FBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTs7Ozs7UUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsSUFB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QUFxQzs7SUFDckMsb0NBQWdDOztJQUNoQyxvQ0FBZ0M7O0lBQ2hDLHFDQUFxRTs7SUFFckUsd0NBQXNHOztJQUN0Ryx3Q0FBb0c7O0lBRXBHLGlDQUFtQjs7SUFDbkIsbUNBQW9COzs7OztJQUVwQixpQ0FhRTs7Ozs7SUFFRixrQ0FBa0M7Ozs7O0lBY2hDLHFDQUEyQjs7Ozs7SUFDM0IsMENBQWtDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBBZnRlclZpZXdJbml0LFxyXG4gIERpcmVjdGl2ZSxcclxuICBEb0NoZWNrLFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIElucHV0LFxyXG4gIE9uQ2hhbmdlcyxcclxuICBPbkRlc3Ryb3ksXHJcbiAgT25Jbml0LFxyXG4gIE91dHB1dCxcclxuICBTaW1wbGVDaGFuZ2VzLFxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBnZXRDb2xvcnMgfSBmcm9tICcuL2dldC1jb2xvcnMnO1xyXG5pbXBvcnQgeyBDb2xvciB9IGZyb20gJy4vY29sb3InO1xyXG5pbXBvcnQgeyBUaGVtZVNlcnZpY2UgfSBmcm9tICcuL3RoZW1lLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgY2xvbmVEZWVwIH0gZnJvbSAnbG9kYXNoLWVzJztcclxuaW1wb3J0IHtcclxuICBDaGFydCxcclxuICBDaGFydENvbmZpZ3VyYXRpb24sXHJcbiAgQ2hhcnREYXRhU2V0cyxcclxuICBDaGFydE9wdGlvbnMsXHJcbiAgQ2hhcnRQb2ludCwgQ2hhcnRUeXBlLFxyXG4gIFBsdWdpblNlcnZpY2VHbG9iYWxSZWdpc3RyYXRpb24sXHJcbiAgUGx1Z2luU2VydmljZVJlZ2lzdHJhdGlvbk9wdGlvbnMsXHJcbiAgcGx1Z2luU2VydmljZVxyXG59IGZyb20gJ2NoYXJ0LmpzJztcclxuXHJcbmV4cG9ydCB0eXBlIFNpbmdsZURhdGFTZXQgPSBBcnJheTxudW1iZXIgfCBudWxsIHwgdW5kZWZpbmVkIHwgbnVtYmVyW10+IHwgQ2hhcnRQb2ludFtdO1xyXG5leHBvcnQgdHlwZSBNdWx0aURhdGFTZXQgPSBTaW5nbGVEYXRhU2V0W107XHJcbmV4cG9ydCB0eXBlIFNpbmdsZU9yTXVsdGlEYXRhU2V0ID0gU2luZ2xlRGF0YVNldCB8IE11bHRpRGF0YVNldDtcclxuXHJcbmV4cG9ydCB0eXBlIFBsdWdpblNlcnZpY2VHbG9iYWxSZWdpc3RyYXRpb25BbmRPcHRpb25zID1cclxuICBQbHVnaW5TZXJ2aWNlR2xvYmFsUmVnaXN0cmF0aW9uXHJcbiAgJiBQbHVnaW5TZXJ2aWNlUmVnaXN0cmF0aW9uT3B0aW9ucztcclxuZXhwb3J0IHR5cGUgU2luZ2xlTGluZUxhYmVsID0gc3RyaW5nO1xyXG5leHBvcnQgdHlwZSBNdWx0aUxpbmVMYWJlbCA9IHN0cmluZ1tdO1xyXG5leHBvcnQgdHlwZSBMYWJlbCA9IFNpbmdsZUxpbmVMYWJlbCB8IE11bHRpTGluZUxhYmVsO1xyXG5cclxuaW50ZXJmYWNlIE9sZFN0YXRlIHtcclxuICBkYXRhRXhpc3RzOiBib29sZWFuO1xyXG4gIGRhdGFMZW5ndGg6IG51bWJlcjtcclxuICBkYXRhc2V0c0V4aXN0czogYm9vbGVhbjtcclxuICBkYXRhc2V0c0xlbmd0aDogbnVtYmVyO1xyXG4gIGRhdGFzZXRzRGF0YU9iamVjdHM6IGFueVtdO1xyXG4gIGRhdGFzZXRzRGF0YUxlbmd0aHM6IG51bWJlcltdO1xyXG4gIGNvbG9yc0V4aXN0czogYm9vbGVhbjtcclxuICBjb2xvcnM6IENvbG9yW107XHJcbiAgbGFiZWxzRXhpc3Q6IGJvb2xlYW47XHJcbiAgbGFiZWxzOiBMYWJlbFtdO1xyXG4gIGxlZ2VuZEV4aXN0czogYm9vbGVhbjtcclxuICBsZWdlbmQ6IHtcclxuICAgIHBvc2l0aW9uPzogc3RyaW5nO1xyXG4gIH07XHJcbn1cclxuXHJcbmVudW0gVXBkYXRlVHlwZSB7XHJcbiAgRGVmYXVsdCxcclxuICBVcGRhdGUsXHJcbiAgUmVmcmVzaFxyXG59XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZGlyZWN0aXZlLXNlbGVjdG9yXHJcbiAgc2VsZWN0b3I6ICdjYW52YXNbYmFzZUNoYXJ0XScsXHJcbiAgZXhwb3J0QXM6ICdiYXNlLWNoYXJ0J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgQmFzZUNoYXJ0RGlyZWN0aXZlIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkluaXQsIE9uRGVzdHJveSwgRG9DaGVjayB7XHJcbiAgQElucHV0KCkgcHVibGljIGRhdGE6IFNpbmdsZU9yTXVsdGlEYXRhU2V0O1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBkYXRhc2V0czogQ2hhcnREYXRhU2V0c1tdO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBsYWJlbHM6IExhYmVsW107XHJcbiAgQElucHV0KCkgcHVibGljIG9wdGlvbnM6IENoYXJ0T3B0aW9ucyA9IHt9O1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBjaGFydFR5cGU6IENoYXJ0VHlwZTtcclxuICBASW5wdXQoKSBwdWJsaWMgY29sb3JzOiBDb2xvcltdO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBsZWdlbmQ6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgcHVibGljIHBsdWdpbnM6IFBsdWdpblNlcnZpY2VHbG9iYWxSZWdpc3RyYXRpb25BbmRPcHRpb25zW107XHJcblxyXG4gIEBPdXRwdXQoKSBwdWJsaWMgY2hhcnRDbGljazogRXZlbnRFbWl0dGVyPHsgZXZlbnQ/OiBNb3VzZUV2ZW50LCBhY3RpdmU/OiB7fVtdIH0+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgY2hhcnRIb3ZlcjogRXZlbnRFbWl0dGVyPHsgZXZlbnQ6IE1vdXNlRXZlbnQsIGFjdGl2ZToge31bXSB9PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgcHVibGljIGN0eDogc3RyaW5nO1xyXG4gIHB1YmxpYyBjaGFydDogQ2hhcnQ7XHJcblxyXG4gIHByaXZhdGUgb2xkOiBPbGRTdGF0ZSA9IHtcclxuICAgIGRhdGFFeGlzdHM6IGZhbHNlLFxyXG4gICAgZGF0YUxlbmd0aDogMCxcclxuICAgIGRhdGFzZXRzRXhpc3RzOiBmYWxzZSxcclxuICAgIGRhdGFzZXRzTGVuZ3RoOiAwLFxyXG4gICAgZGF0YXNldHNEYXRhT2JqZWN0czogW10sXHJcbiAgICBkYXRhc2V0c0RhdGFMZW5ndGhzOiBbXSxcclxuICAgIGNvbG9yc0V4aXN0czogZmFsc2UsXHJcbiAgICBjb2xvcnM6IFtdLFxyXG4gICAgbGFiZWxzRXhpc3Q6IGZhbHNlLFxyXG4gICAgbGFiZWxzOiBbXSxcclxuICAgIGxlZ2VuZEV4aXN0czogZmFsc2UsXHJcbiAgICBsZWdlbmQ6IHt9LFxyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgc3ViczogU3Vic2NyaXB0aW9uW10gPSBbXTtcclxuXHJcbiAgLyoqXHJcbiAgICogUmVnaXN0ZXIgYSBwbHVnaW4uXHJcbiAgICovXHJcbiAgcHVibGljIHN0YXRpYyByZWdpc3RlclBsdWdpbihwbHVnaW46IFBsdWdpblNlcnZpY2VHbG9iYWxSZWdpc3RyYXRpb25BbmRPcHRpb25zKTogdm9pZCB7XHJcbiAgICBwbHVnaW5TZXJ2aWNlLnJlZ2lzdGVyKHBsdWdpbik7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIHVucmVnaXN0ZXJQbHVnaW4ocGx1Z2luOiBQbHVnaW5TZXJ2aWNlR2xvYmFsUmVnaXN0cmF0aW9uQW5kT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgcGx1Z2luU2VydmljZS51bnJlZ2lzdGVyKHBsdWdpbik7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnRSZWYsXHJcbiAgICBwcml2YXRlIHRoZW1lU2VydmljZTogVGhlbWVTZXJ2aWNlLFxyXG4gICkgeyB9XHJcblxyXG4gIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgIHRoaXMuY3R4ID0gdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gICAgdGhpcy5zdWJzLnB1c2godGhpcy50aGVtZVNlcnZpY2UuY29sb3JzY2hlbWVzT3B0aW9ucy5zdWJzY3JpYmUociA9PiB0aGlzLnRoZW1lQ2hhbmdlZChyKSkpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0aGVtZUNoYW5nZWQob3B0aW9uczoge30pOiB2b2lkIHtcclxuICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gIH1cclxuXHJcbiAgbmdEb0NoZWNrKCk6IHZvaWQge1xyXG4gICAgaWYgKCF0aGlzLmNoYXJ0KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCB1cGRhdGVSZXF1aXJlZCA9IFVwZGF0ZVR5cGUuRGVmYXVsdDtcclxuICAgIGNvbnN0IHdhbnRVcGRhdGUgPSAoeDogVXBkYXRlVHlwZSkgPT4ge1xyXG4gICAgICB1cGRhdGVSZXF1aXJlZCA9IHggPiB1cGRhdGVSZXF1aXJlZCA/IHggOiB1cGRhdGVSZXF1aXJlZDtcclxuICAgIH07XHJcblxyXG4gICAgaWYgKCEhdGhpcy5kYXRhICE9PSB0aGlzLm9sZC5kYXRhRXhpc3RzKSB7XHJcbiAgICAgIHRoaXMucHJvcGFnYXRlRGF0YVRvRGF0YXNldHModGhpcy5kYXRhKTtcclxuXHJcbiAgICAgIHRoaXMub2xkLmRhdGFFeGlzdHMgPSAhIXRoaXMuZGF0YTtcclxuXHJcbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5VcGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmRhdGEgJiYgdGhpcy5kYXRhLmxlbmd0aCAhPT0gdGhpcy5vbGQuZGF0YUxlbmd0aCkge1xyXG4gICAgICB0aGlzLm9sZC5kYXRhTGVuZ3RoID0gdGhpcy5kYXRhICYmIHRoaXMuZGF0YS5sZW5ndGggfHwgMDtcclxuXHJcbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5VcGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghIXRoaXMuZGF0YXNldHMgIT09IHRoaXMub2xkLmRhdGFzZXRzRXhpc3RzKSB7XHJcbiAgICAgIHRoaXMub2xkLmRhdGFzZXRzRXhpc3RzID0gISF0aGlzLmRhdGFzZXRzO1xyXG5cclxuICAgICAgd2FudFVwZGF0ZShVcGRhdGVUeXBlLlVwZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuZGF0YXNldHMgJiYgdGhpcy5kYXRhc2V0cy5sZW5ndGggIT09IHRoaXMub2xkLmRhdGFzZXRzTGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMub2xkLmRhdGFzZXRzTGVuZ3RoID0gdGhpcy5kYXRhc2V0cyAmJiB0aGlzLmRhdGFzZXRzLmxlbmd0aCB8fCAwO1xyXG5cclxuICAgICAgd2FudFVwZGF0ZShVcGRhdGVUeXBlLlVwZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuZGF0YXNldHMgJiYgdGhpcy5kYXRhc2V0cy5maWx0ZXIoKHgsIGkpID0+IHguZGF0YSAhPT0gdGhpcy5vbGQuZGF0YXNldHNEYXRhT2JqZWN0c1tpXSkubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMub2xkLmRhdGFzZXRzRGF0YU9iamVjdHMgPSB0aGlzLmRhdGFzZXRzLm1hcCh4ID0+IHguZGF0YSk7XHJcblxyXG4gICAgICB3YW50VXBkYXRlKFVwZGF0ZVR5cGUuVXBkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5kYXRhc2V0cyAmJiB0aGlzLmRhdGFzZXRzLmZpbHRlcigoeCwgaSkgPT4geC5kYXRhLmxlbmd0aCAhPT0gdGhpcy5vbGQuZGF0YXNldHNEYXRhTGVuZ3Roc1tpXSkubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMub2xkLmRhdGFzZXRzRGF0YUxlbmd0aHMgPSB0aGlzLmRhdGFzZXRzLm1hcCh4ID0+IHguZGF0YS5sZW5ndGgpO1xyXG5cclxuICAgICAgd2FudFVwZGF0ZShVcGRhdGVUeXBlLlVwZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCEhdGhpcy5jb2xvcnMgIT09IHRoaXMub2xkLmNvbG9yc0V4aXN0cykge1xyXG4gICAgICB0aGlzLm9sZC5jb2xvcnNFeGlzdHMgPSAhIXRoaXMuY29sb3JzO1xyXG5cclxuICAgICAgdGhpcy51cGRhdGVDb2xvcnMoKTtcclxuXHJcbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5VcGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFRoaXMgc21lbGxzIG9mIGluZWZmaWNpZW5jeSwgbWlnaHQgbmVlZCB0byByZXZpc2l0IHRoaXNcclxuICAgIGlmICh0aGlzLmNvbG9ycyAmJiB0aGlzLmNvbG9ycy5maWx0ZXIoKHgsIGkpID0+ICF0aGlzLmNvbG9yc0VxdWFsKHgsIHRoaXMub2xkLmNvbG9yc1tpXSkpLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLm9sZC5jb2xvcnMgPSB0aGlzLmNvbG9ycy5tYXAoeCA9PiB0aGlzLmNvcHlDb2xvcih4KSk7XHJcblxyXG4gICAgICB0aGlzLnVwZGF0ZUNvbG9ycygpO1xyXG5cclxuICAgICAgd2FudFVwZGF0ZShVcGRhdGVUeXBlLlVwZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCEhdGhpcy5sYWJlbHMgIT09IHRoaXMub2xkLmxhYmVsc0V4aXN0KSB7XHJcbiAgICAgIHRoaXMub2xkLmxhYmVsc0V4aXN0ID0gISF0aGlzLmxhYmVscztcclxuXHJcbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5VcGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmxhYmVscyAmJiB0aGlzLmxhYmVscy5maWx0ZXIoKHgsIGkpID0+ICF0aGlzLmxhYmVsc0VxdWFsKHgsIHRoaXMub2xkLmxhYmVsc1tpXSkpLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLm9sZC5sYWJlbHMgPSB0aGlzLmxhYmVscy5tYXAoeCA9PiB0aGlzLmNvcHlMYWJlbCh4KSk7XHJcblxyXG4gICAgICB3YW50VXBkYXRlKFVwZGF0ZVR5cGUuVXBkYXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoISF0aGlzLm9wdGlvbnMubGVnZW5kICE9PSB0aGlzLm9sZC5sZWdlbmRFeGlzdHMpIHtcclxuICAgICAgdGhpcy5vbGQubGVnZW5kRXhpc3RzID0gISF0aGlzLm9wdGlvbnMubGVnZW5kO1xyXG5cclxuICAgICAgd2FudFVwZGF0ZShVcGRhdGVUeXBlLlJlZnJlc2gpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMubGVnZW5kICYmIHRoaXMub3B0aW9ucy5sZWdlbmQucG9zaXRpb24gIT09IHRoaXMub2xkLmxlZ2VuZC5wb3NpdGlvbikge1xyXG4gICAgICB0aGlzLm9sZC5sZWdlbmQucG9zaXRpb24gPSB0aGlzLm9wdGlvbnMubGVnZW5kLnBvc2l0aW9uO1xyXG5cclxuICAgICAgd2FudFVwZGF0ZShVcGRhdGVUeXBlLlJlZnJlc2gpO1xyXG4gICAgfVxyXG5cclxuICAgIHN3aXRjaCAodXBkYXRlUmVxdWlyZWQgYXMgVXBkYXRlVHlwZSkge1xyXG4gICAgICBjYXNlIFVwZGF0ZVR5cGUuRGVmYXVsdDpcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBVcGRhdGVUeXBlLlVwZGF0ZTpcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIFVwZGF0ZVR5cGUuUmVmcmVzaDpcclxuICAgICAgICB0aGlzLnJlZnJlc2goKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvcHlMYWJlbChhOiBMYWJlbCk6IExhYmVsIHtcclxuICAgIGlmIChBcnJheS5pc0FycmF5KGEpKSB7XHJcbiAgICAgIHJldHVybiBbLi4uYV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYTtcclxuICB9XHJcblxyXG4gIGxhYmVsc0VxdWFsKGE6IExhYmVsLCBiOiBMYWJlbCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYSkgPT09IEFycmF5LmlzQXJyYXkoYilcclxuICAgICAgJiYgKEFycmF5LmlzQXJyYXkoYSkgfHwgYSA9PT0gYilcclxuICAgICAgJiYgKCFBcnJheS5pc0FycmF5KGEpIHx8IGEubGVuZ3RoID09PSBiLmxlbmd0aClcclxuICAgICAgJiYgKCFBcnJheS5pc0FycmF5KGEpIHx8IGEuZmlsdGVyKCh4LCBpKSA9PiB4ICE9PSBiW2ldKS5sZW5ndGggPT09IDApXHJcbiAgICAgIDtcclxuICB9XHJcblxyXG4gIGNvcHlDb2xvcihhOiBDb2xvcik6IENvbG9yIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGJhY2tncm91bmRDb2xvcjogYS5iYWNrZ3JvdW5kQ29sb3IsXHJcbiAgICAgIGJvcmRlcldpZHRoOiBhLmJvcmRlcldpZHRoLFxyXG4gICAgICBib3JkZXJDb2xvcjogYS5ib3JkZXJDb2xvcixcclxuICAgICAgYm9yZGVyQ2FwU3R5bGU6IGEuYm9yZGVyQ2FwU3R5bGUsXHJcbiAgICAgIGJvcmRlckRhc2g6IGEuYm9yZGVyRGFzaCxcclxuICAgICAgYm9yZGVyRGFzaE9mZnNldDogYS5ib3JkZXJEYXNoT2Zmc2V0LFxyXG4gICAgICBib3JkZXJKb2luU3R5bGU6IGEuYm9yZGVySm9pblN0eWxlLFxyXG4gICAgICBwb2ludEJvcmRlckNvbG9yOiBhLnBvaW50Qm9yZGVyQ29sb3IsXHJcbiAgICAgIHBvaW50QmFja2dyb3VuZENvbG9yOiBhLnBvaW50QmFja2dyb3VuZENvbG9yLFxyXG4gICAgICBwb2ludEJvcmRlcldpZHRoOiBhLnBvaW50Qm9yZGVyV2lkdGgsXHJcbiAgICAgIHBvaW50UmFkaXVzOiBhLnBvaW50UmFkaXVzLFxyXG4gICAgICBwb2ludEhvdmVyUmFkaXVzOiBhLnBvaW50SG92ZXJSYWRpdXMsXHJcbiAgICAgIHBvaW50SGl0UmFkaXVzOiBhLnBvaW50SGl0UmFkaXVzLFxyXG4gICAgICBwb2ludEhvdmVyQmFja2dyb3VuZENvbG9yOiBhLnBvaW50SG92ZXJCYWNrZ3JvdW5kQ29sb3IsXHJcbiAgICAgIHBvaW50SG92ZXJCb3JkZXJDb2xvcjogYS5wb2ludEhvdmVyQm9yZGVyQ29sb3IsXHJcbiAgICAgIHBvaW50SG92ZXJCb3JkZXJXaWR0aDogYS5wb2ludEhvdmVyQm9yZGVyV2lkdGgsXHJcbiAgICAgIHBvaW50U3R5bGU6IGEucG9pbnRTdHlsZSxcclxuICAgICAgaG92ZXJCYWNrZ3JvdW5kQ29sb3I6IGEuaG92ZXJCYWNrZ3JvdW5kQ29sb3IsXHJcbiAgICAgIGhvdmVyQm9yZGVyQ29sb3I6IGEuaG92ZXJCb3JkZXJDb2xvcixcclxuICAgICAgaG92ZXJCb3JkZXJXaWR0aDogYS5ob3ZlckJvcmRlcldpZHRoLFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGNvbG9yc0VxdWFsKGE6IENvbG9yLCBiOiBDb2xvcik6IGJvb2xlYW4ge1xyXG4gICAgaWYgKCFhICE9PSAhYikge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gIWEgfHxcclxuICAgICAgKGEuYmFja2dyb3VuZENvbG9yID09PSBiLmJhY2tncm91bmRDb2xvcilcclxuICAgICAgJiYgKGEuYm9yZGVyV2lkdGggPT09IGIuYm9yZGVyV2lkdGgpXHJcbiAgICAgICYmIChhLmJvcmRlckNvbG9yID09PSBiLmJvcmRlckNvbG9yKVxyXG4gICAgICAmJiAoYS5ib3JkZXJDYXBTdHlsZSA9PT0gYi5ib3JkZXJDYXBTdHlsZSlcclxuICAgICAgJiYgKGEuYm9yZGVyRGFzaCA9PT0gYi5ib3JkZXJEYXNoKVxyXG4gICAgICAmJiAoYS5ib3JkZXJEYXNoT2Zmc2V0ID09PSBiLmJvcmRlckRhc2hPZmZzZXQpXHJcbiAgICAgICYmIChhLmJvcmRlckpvaW5TdHlsZSA9PT0gYi5ib3JkZXJKb2luU3R5bGUpXHJcbiAgICAgICYmIChhLnBvaW50Qm9yZGVyQ29sb3IgPT09IGIucG9pbnRCb3JkZXJDb2xvcilcclxuICAgICAgJiYgKGEucG9pbnRCYWNrZ3JvdW5kQ29sb3IgPT09IGIucG9pbnRCYWNrZ3JvdW5kQ29sb3IpXHJcbiAgICAgICYmIChhLnBvaW50Qm9yZGVyV2lkdGggPT09IGIucG9pbnRCb3JkZXJXaWR0aClcclxuICAgICAgJiYgKGEucG9pbnRSYWRpdXMgPT09IGIucG9pbnRSYWRpdXMpXHJcbiAgICAgICYmIChhLnBvaW50SG92ZXJSYWRpdXMgPT09IGIucG9pbnRIb3ZlclJhZGl1cylcclxuICAgICAgJiYgKGEucG9pbnRIaXRSYWRpdXMgPT09IGIucG9pbnRIaXRSYWRpdXMpXHJcbiAgICAgICYmIChhLnBvaW50SG92ZXJCYWNrZ3JvdW5kQ29sb3IgPT09IGIucG9pbnRIb3ZlckJhY2tncm91bmRDb2xvcilcclxuICAgICAgJiYgKGEucG9pbnRIb3ZlckJvcmRlckNvbG9yID09PSBiLnBvaW50SG92ZXJCb3JkZXJDb2xvcilcclxuICAgICAgJiYgKGEucG9pbnRIb3ZlckJvcmRlcldpZHRoID09PSBiLnBvaW50SG92ZXJCb3JkZXJXaWR0aClcclxuICAgICAgJiYgKGEucG9pbnRTdHlsZSA9PT0gYi5wb2ludFN0eWxlKVxyXG4gICAgICAmJiAoYS5ob3ZlckJhY2tncm91bmRDb2xvciA9PT0gYi5ob3ZlckJhY2tncm91bmRDb2xvcilcclxuICAgICAgJiYgKGEuaG92ZXJCb3JkZXJDb2xvciA9PT0gYi5ob3ZlckJvcmRlckNvbG9yKVxyXG4gICAgICAmJiAoYS5ob3ZlckJvcmRlcldpZHRoID09PSBiLmhvdmVyQm9yZGVyV2lkdGgpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlQ29sb3JzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5kYXRhc2V0cy5mb3JFYWNoKChlbG0sIGluZGV4KSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmNvbG9ycyAmJiB0aGlzLmNvbG9yc1tpbmRleF0pIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKGVsbSwgdGhpcy5jb2xvcnNbaW5kZXhdKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBPYmplY3QuYXNzaWduKGVsbSwgZ2V0Q29sb3JzKHRoaXMuY2hhcnRUeXBlLCBpbmRleCwgZWxtLmRhdGEubGVuZ3RoKSwgeyAuLi5lbG0gfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcclxuICAgIGxldCB1cGRhdGVSZXF1aXJlZCA9IFVwZGF0ZVR5cGUuRGVmYXVsdDtcclxuICAgIGNvbnN0IHdhbnRVcGRhdGUgPSAoeDogVXBkYXRlVHlwZSkgPT4ge1xyXG4gICAgICB1cGRhdGVSZXF1aXJlZCA9IHggPiB1cGRhdGVSZXF1aXJlZCA/IHggOiB1cGRhdGVSZXF1aXJlZDtcclxuICAgIH07XHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgdGhlIGNoYW5nZXMgYXJlIGluIHRoZSBkYXRhIG9yIGRhdGFzZXRzIG9yIGxhYmVscyBvciBsZWdlbmRcclxuXHJcbiAgICBpZiAoY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnZGF0YScpICYmIGNoYW5nZXMuZGF0YS5jdXJyZW50VmFsdWUpIHtcclxuICAgICAgdGhpcy5wcm9wYWdhdGVEYXRhVG9EYXRhc2V0cyhjaGFuZ2VzLmRhdGEuY3VycmVudFZhbHVlKTtcclxuXHJcbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5VcGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGFuZ2VzLmhhc093blByb3BlcnR5KCdkYXRhc2V0cycpICYmIGNoYW5nZXMuZGF0YXNldHMuY3VycmVudFZhbHVlKSB7XHJcbiAgICAgIHRoaXMucHJvcGFnYXRlRGF0YXNldHNUb0RhdGEoY2hhbmdlcy5kYXRhc2V0cy5jdXJyZW50VmFsdWUpO1xyXG5cclxuICAgICAgd2FudFVwZGF0ZShVcGRhdGVUeXBlLlVwZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ2xhYmVscycpKSB7XHJcbiAgICAgIGlmICh0aGlzLmNoYXJ0KSB7XHJcbiAgICAgICAgdGhpcy5jaGFydC5kYXRhLmxhYmVscyA9IGNoYW5nZXMubGFiZWxzLmN1cnJlbnRWYWx1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgd2FudFVwZGF0ZShVcGRhdGVUeXBlLlVwZGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ2xlZ2VuZCcpKSB7XHJcbiAgICAgIGlmICh0aGlzLmNoYXJ0KSB7XHJcbiAgICAgICAgdGhpcy5jaGFydC5jb25maWcub3B0aW9ucy5sZWdlbmQuZGlzcGxheSA9IGNoYW5nZXMubGVnZW5kLmN1cnJlbnRWYWx1ZTtcclxuICAgICAgICB0aGlzLmNoYXJ0LmdlbmVyYXRlTGVnZW5kKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5VcGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGFuZ2VzLmhhc093blByb3BlcnR5KCdvcHRpb25zJykpIHtcclxuICAgICAgd2FudFVwZGF0ZShVcGRhdGVUeXBlLlJlZnJlc2gpO1xyXG4gICAgfVxyXG5cclxuICAgIHN3aXRjaCAodXBkYXRlUmVxdWlyZWQgYXMgVXBkYXRlVHlwZSkge1xyXG4gICAgICBjYXNlIFVwZGF0ZVR5cGUuVXBkYXRlOlxyXG4gICAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgVXBkYXRlVHlwZS5SZWZyZXNoOlxyXG4gICAgICBjYXNlIFVwZGF0ZVR5cGUuRGVmYXVsdDpcclxuICAgICAgICB0aGlzLnJlZnJlc2goKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmNoYXJ0KSB7XHJcbiAgICAgIHRoaXMuY2hhcnQuZGVzdHJveSgpO1xyXG4gICAgICB0aGlzLmNoYXJ0ID0gdm9pZCAwO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zdWJzLmZvckVhY2goeCA9PiB4LnVuc3Vic2NyaWJlKCkpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHVwZGF0ZShkdXJhdGlvbj86IGFueSk6IHt9IHtcclxuICAgIGlmICh0aGlzLmNoYXJ0KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmNoYXJ0LnVwZGF0ZShkdXJhdGlvbik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaGlkZURhdGFzZXQoaW5kZXg6IG51bWJlciwgaGlkZGVuOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICB0aGlzLmNoYXJ0LmdldERhdGFzZXRNZXRhKGluZGV4KS5oaWRkZW4gPSBoaWRkZW47XHJcbiAgICB0aGlzLmNoYXJ0LnVwZGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGlzRGF0YXNldEhpZGRlbihpbmRleDogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5jaGFydC5nZXREYXRhc2V0TWV0YShpbmRleCkuaGlkZGVuO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHRvQmFzZTY0SW1hZ2UoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLmNoYXJ0LnRvQmFzZTY0SW1hZ2UoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRDaGFydENvbmZpZ3VyYXRpb24oKTogQ2hhcnRDb25maWd1cmF0aW9uIHtcclxuICAgIGNvbnN0IGRhdGFzZXRzID0gdGhpcy5nZXREYXRhc2V0cygpO1xyXG5cclxuICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLm9wdGlvbnMpO1xyXG4gICAgaWYgKHRoaXMubGVnZW5kID09PSBmYWxzZSkge1xyXG4gICAgICBvcHRpb25zLmxlZ2VuZCA9IHsgZGlzcGxheTogZmFsc2UgfTtcclxuICAgIH1cclxuICAgIC8vIGhvb2sgZm9yIG9uSG92ZXIgYW5kIG9uQ2xpY2sgZXZlbnRzXHJcbiAgICBvcHRpb25zLmhvdmVyID0gb3B0aW9ucy5ob3ZlciB8fCB7fTtcclxuICAgIGlmICghb3B0aW9ucy5ob3Zlci5vbkhvdmVyKSB7XHJcbiAgICAgIG9wdGlvbnMuaG92ZXIub25Ib3ZlciA9IChldmVudDogTW91c2VFdmVudCwgYWN0aXZlOiB7fVtdKSA9PiB7XHJcbiAgICAgICAgaWYgKGFjdGl2ZSAmJiAhYWN0aXZlLmxlbmd0aCkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNoYXJ0SG92ZXIuZW1pdCh7IGV2ZW50LCBhY3RpdmUgfSk7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFvcHRpb25zLm9uQ2xpY2spIHtcclxuICAgICAgb3B0aW9ucy5vbkNsaWNrID0gKGV2ZW50PzogTW91c2VFdmVudCwgYWN0aXZlPzoge31bXSkgPT4ge1xyXG4gICAgICAgIHRoaXMuY2hhcnRDbGljay5lbWl0KHsgZXZlbnQsIGFjdGl2ZSB9KTtcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBtZXJnZWRPcHRpb25zID0gdGhpcy5zbWFydE1lcmdlKG9wdGlvbnMsIHRoaXMudGhlbWVTZXJ2aWNlLmdldENvbG9yc2NoZW1lc09wdGlvbnMoKSk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogdGhpcy5jaGFydFR5cGUsXHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICBsYWJlbHM6IHRoaXMubGFiZWxzIHx8IFtdLFxyXG4gICAgICAgIGRhdGFzZXRzXHJcbiAgICAgIH0sXHJcbiAgICAgIHBsdWdpbnM6IHRoaXMucGx1Z2lucyxcclxuICAgICAgb3B0aW9uczogbWVyZ2VkT3B0aW9ucyxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0Q2hhcnRCdWlsZGVyKGN0eDogc3RyaW5nLyosIGRhdGE6YW55W10sIG9wdGlvbnM6YW55Ki8pOiBDaGFydCB7XHJcbiAgICBjb25zdCBjaGFydENvbmZpZyA9IHRoaXMuZ2V0Q2hhcnRDb25maWd1cmF0aW9uKCk7XHJcbiAgICByZXR1cm4gbmV3IENoYXJ0KGN0eCwgY2hhcnRDb25maWcpO1xyXG4gIH1cclxuXHJcbiAgc21hcnRNZXJnZShvcHRpb25zOiBhbnksIG92ZXJyaWRlczogYW55LCBsZXZlbDogbnVtYmVyID0gMCk6IGFueSB7XHJcbiAgICBpZiAobGV2ZWwgPT09IDApIHtcclxuICAgICAgb3B0aW9ucyA9IGNsb25lRGVlcChvcHRpb25zKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGtleXNUb1VwZGF0ZSA9IE9iamVjdC5rZXlzKG92ZXJyaWRlcyk7XHJcbiAgICBrZXlzVG9VcGRhdGUuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShvdmVycmlkZXNba2V5XSkpIHtcclxuICAgICAgICBjb25zdCBhcnJheUVsZW1lbnRzID0gb3B0aW9uc1trZXldO1xyXG4gICAgICAgIGlmIChhcnJheUVsZW1lbnRzKSB7XHJcbiAgICAgICAgICBhcnJheUVsZW1lbnRzLmZvckVhY2gociA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc21hcnRNZXJnZShyLCBvdmVycmlkZXNba2V5XVswXSwgbGV2ZWwgKyAxKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgKG92ZXJyaWRlc1trZXldKSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICBpZiAoIShrZXkgaW4gb3B0aW9ucykpIHtcclxuICAgICAgICAgIG9wdGlvbnNba2V5XSA9IHt9O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNtYXJ0TWVyZ2Uob3B0aW9uc1trZXldLCBvdmVycmlkZXNba2V5XSwgbGV2ZWwgKyAxKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvcHRpb25zW2tleV0gPSBvdmVycmlkZXNba2V5XTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBpZiAobGV2ZWwgPT09IDApIHtcclxuICAgICAgcmV0dXJuIG9wdGlvbnM7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGlzTXVsdGlMaW5lTGFiZWwobGFiZWw6IExhYmVsKTogbGFiZWwgaXMgTXVsdGlMaW5lTGFiZWwge1xyXG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkobGFiZWwpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBqb2luTGFiZWwobGFiZWw6IExhYmVsKTogc3RyaW5nIHtcclxuICAgIGlmICghbGFiZWwpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5pc011bHRpTGluZUxhYmVsKGxhYmVsKSkge1xyXG4gICAgICByZXR1cm4gbGFiZWwuam9pbignICcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGxhYmVsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwcm9wYWdhdGVEYXRhc2V0c1RvRGF0YShkYXRhc2V0czogQ2hhcnREYXRhU2V0c1tdKTogdm9pZCB7XHJcbiAgICB0aGlzLmRhdGEgPSB0aGlzLmRhdGFzZXRzLm1hcChyID0+IHIuZGF0YSk7XHJcbiAgICBpZiAodGhpcy5jaGFydCkge1xyXG4gICAgICB0aGlzLmNoYXJ0LmRhdGEuZGF0YXNldHMgPSBkYXRhc2V0cztcclxuICAgIH1cclxuICAgIHRoaXMudXBkYXRlQ29sb3JzKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHByb3BhZ2F0ZURhdGFUb0RhdGFzZXRzKG5ld0RhdGFWYWx1ZXM6IFNpbmdsZU9yTXVsdGlEYXRhU2V0KTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5pc011bHRpRGF0YVNldChuZXdEYXRhVmFsdWVzKSkge1xyXG4gICAgICBpZiAodGhpcy5kYXRhc2V0cyAmJiBuZXdEYXRhVmFsdWVzLmxlbmd0aCA9PT0gdGhpcy5kYXRhc2V0cy5sZW5ndGgpIHtcclxuICAgICAgICB0aGlzLmRhdGFzZXRzLmZvckVhY2goKGRhdGFzZXQsIGk6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgZGF0YXNldC5kYXRhID0gbmV3RGF0YVZhbHVlc1tpXTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmRhdGFzZXRzID0gbmV3RGF0YVZhbHVlcy5tYXAoKGRhdGE6IG51bWJlcltdLCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4geyBkYXRhLCBsYWJlbDogdGhpcy5qb2luTGFiZWwodGhpcy5sYWJlbHNbaW5kZXhdKSB8fCBgTGFiZWwgJHtpbmRleH1gIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHRoaXMuY2hhcnQpIHtcclxuICAgICAgICAgIHRoaXMuY2hhcnQuZGF0YS5kYXRhc2V0cyA9IHRoaXMuZGF0YXNldHM7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoIXRoaXMuZGF0YXNldHMpIHtcclxuICAgICAgICB0aGlzLmRhdGFzZXRzID0gW3sgZGF0YTogbmV3RGF0YVZhbHVlcyB9XTtcclxuICAgICAgICBpZiAodGhpcy5jaGFydCkge1xyXG4gICAgICAgICAgdGhpcy5jaGFydC5kYXRhLmRhdGFzZXRzID0gdGhpcy5kYXRhc2V0cztcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmRhdGFzZXRzWzBdKSB7XHJcbiAgICAgICAgICB0aGlzLmRhdGFzZXRzWzBdID0ge307XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmRhdGFzZXRzWzBdLmRhdGEgPSBuZXdEYXRhVmFsdWVzO1xyXG4gICAgICAgIHRoaXMuZGF0YXNldHMuc3BsaWNlKDEpOyAvLyBSZW1vdmUgYWxsIGVsZW1lbnRzIGJ1dCB0aGUgZmlyc3RcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy51cGRhdGVDb2xvcnMoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaXNNdWx0aURhdGFTZXQoZGF0YTogU2luZ2xlT3JNdWx0aURhdGFTZXQpOiBkYXRhIGlzIE11bHRpRGF0YVNldCB7XHJcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShkYXRhWzBdKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0RGF0YXNldHMoKTogQ2hhcnQuQ2hhcnREYXRhU2V0c1tdIHtcclxuICAgIGlmICghdGhpcy5kYXRhc2V0cyAmJiAhdGhpcy5kYXRhKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgbmctY2hhcnRzIGNvbmZpZ3VyYXRpb24gZXJyb3IsIGRhdGEgb3IgZGF0YXNldHMgZmllbGQgYXJlIHJlcXVpcmVkIHRvIHJlbmRlciBjaGFydCAkeyB0aGlzLmNoYXJ0VHlwZSB9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSWYgYGRhdGFzZXRzYCBpcyBkZWZpbmVkLCB1c2UgaXQgb3ZlciB0aGUgYGRhdGFgIHByb3BlcnR5LlxyXG4gICAgaWYgKHRoaXMuZGF0YXNldHMpIHtcclxuICAgICAgdGhpcy5wcm9wYWdhdGVEYXRhc2V0c1RvRGF0YSh0aGlzLmRhdGFzZXRzKTtcclxuICAgICAgcmV0dXJuIHRoaXMuZGF0YXNldHM7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuZGF0YSkge1xyXG4gICAgICB0aGlzLnByb3BhZ2F0ZURhdGFUb0RhdGFzZXRzKHRoaXMuZGF0YSk7XHJcbiAgICAgIHJldHVybiB0aGlzLmRhdGFzZXRzO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWZyZXNoKCk6IHZvaWQge1xyXG4gICAgLy8gaWYgKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMucmVzcG9uc2l2ZSkge1xyXG4gICAgLy8gICBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVmcmVzaCgpLCA1MCk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gdG9kbzogcmVtb3ZlIHRoaXMgbGluZSwgaXQgaXMgcHJvZHVjaW5nIGZsaWNrZXJpbmdcclxuICAgIGlmICh0aGlzLmNoYXJ0KSB7XHJcbiAgICAgIHRoaXMuY2hhcnQuZGVzdHJveSgpO1xyXG4gICAgICB0aGlzLmNoYXJ0ID0gdm9pZCAwO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuY3R4KSB7XHJcbiAgICAgIHRoaXMuY2hhcnQgPSB0aGlzLmdldENoYXJ0QnVpbGRlcih0aGlzLmN0eC8qLCBkYXRhLCB0aGlzLm9wdGlvbnMqLyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==
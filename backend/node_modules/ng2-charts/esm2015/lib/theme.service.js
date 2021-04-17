/**
 * @fileoverview added by tsickle
 * Generated from: lib/theme.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export class ThemeService {
    constructor() {
        this.pColorschemesOptions = {};
        this.colorschemesOptions = new BehaviorSubject({});
    }
    /**
     * @param {?} options
     * @return {?}
     */
    setColorschemesOptions(options) {
        this.pColorschemesOptions = options;
        this.colorschemesOptions.next(options);
    }
    /**
     * @return {?}
     */
    getColorschemesOptions() {
        return this.pColorschemesOptions;
    }
}
ThemeService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
ThemeService.ctorParameters = () => [];
/** @nocollapse */ ThemeService.ɵprov = i0.ɵɵdefineInjectable({ factory: function ThemeService_Factory() { return new ThemeService(); }, token: ThemeService, providedIn: "root" });
if (false) {
    /**
     * @type {?}
     * @private
     */
    ThemeService.prototype.pColorschemesOptions;
    /** @type {?} */
    ThemeService.prototype.colorschemesOptions;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25nMi1jaGFydHMvc3JjL2xpYi90aGVtZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sTUFBTSxDQUFDOztBQU12QyxNQUFNLE9BQU8sWUFBWTtJQUl2QjtRQUhRLHlCQUFvQixHQUFpQixFQUFFLENBQUM7UUFDekMsd0JBQW1CLEdBQUcsSUFBSSxlQUFlLENBQWUsRUFBRSxDQUFDLENBQUM7SUFFbkQsQ0FBQzs7Ozs7SUFFakIsc0JBQXNCLENBQUMsT0FBcUI7UUFDMUMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLE9BQU8sQ0FBQztRQUNwQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3pDLENBQUM7Ozs7SUFFRCxzQkFBc0I7UUFDcEIsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUM7SUFDbkMsQ0FBQzs7O1lBaEJGLFVBQVUsU0FBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQjs7Ozs7Ozs7OztJQUVDLDRDQUFnRDs7SUFDaEQsMkNBQW1FIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQ2hhcnRPcHRpb25zIH0gZnJvbSAnY2hhcnQuanMnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgVGhlbWVTZXJ2aWNlIHtcclxuICBwcml2YXRlIHBDb2xvcnNjaGVtZXNPcHRpb25zOiBDaGFydE9wdGlvbnMgPSB7fTtcclxuICBwdWJsaWMgY29sb3JzY2hlbWVzT3B0aW9ucyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Q2hhcnRPcHRpb25zPih7fSk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG4gIHNldENvbG9yc2NoZW1lc09wdGlvbnMob3B0aW9uczogQ2hhcnRPcHRpb25zKTogdm9pZCB7XHJcbiAgICB0aGlzLnBDb2xvcnNjaGVtZXNPcHRpb25zID0gb3B0aW9ucztcclxuICAgIHRoaXMuY29sb3JzY2hlbWVzT3B0aW9ucy5uZXh0KG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q29sb3JzY2hlbWVzT3B0aW9ucygpOiBDaGFydE9wdGlvbnMge1xyXG4gICAgcmV0dXJuIHRoaXMucENvbG9yc2NoZW1lc09wdGlvbnM7XHJcbiAgfVxyXG59XHJcbiJdfQ==
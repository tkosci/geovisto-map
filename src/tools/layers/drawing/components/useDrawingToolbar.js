import React from 'react';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { dividePoly, normalStyles, polygonCreate, polylineCreate, slicePoly } from '../util/Poly';
import { connectClick, markerCreate } from '../util/Marker';

import '../style/drawingLayer.scss';
import paintPoly from './paintPoly';

import * as turf from '@turf/turf';

const UNABLE_TO_CLICK_DISABLE = ['lineBtn', 'markerBtn', 'polygonBtn'];

/**
 * @author Andrej Tlcina
 */
export default function useDrawingToolbar() {
  L.Control.DrawingToolbar = L.Control.extend({
    options: {
      position: 'topleft',
      drawingBtns: {},
    },
    /**
     * runs whenever you create instance
     *
     * @param {Object} options
     */
    initialize: function (options) {
      if (options) {
        L.setOptions(this, options);
      }
    },
    /**
     * runs whenever control is being added
     *
     * @param {Object} map
     * @returns
     */
    onAdd: function (map) {
      this.options.map = map;
      return this.createUi();
    },
    /**
     * creates toolbar with multiple buttons
     *
     * @param {Object} map
     * @returns HTML element wrapping all the buttons
     */
    createUi: function (map) {
      const topContainer = L.DomUtil.create('div', 'drawingtoolbar');
      const toolContainer = L.DomUtil.create('div', 'leaflet-bar leaflet-control', topContainer);
      toolContainer.style.cursor = 'pointer';
      const cancalables = [];

      const toggleExtra = (e, tool) => {
        cancalables.forEach((btn) => btn.lastChild.classList.add('hide'));
        let extraBtn = e.target.lastChild;
        if (!extraBtn) extraBtn = e.target.nextSibling;
        extraBtn.classList.toggle('hide');
        L.DomEvent.on(extraBtn, 'click', (e) => this._disableDrawing(e, tool), this);
      };

      const drawingTools = this.options.tool.drawingTools;

      Object.keys(drawingTools).forEach((key) => {
        let tool = drawingTools[key];
        let canBeCanceled = tool.canBeCanceled();

        let btn = this.createToolbarBtn(
          tool.getName(),
          toolContainer,
          tool.getTitle(),
          tool.getIconName(),
          canBeCanceled,
        );

        if (canBeCanceled) cancalables.push(btn);

        L.DomEvent.on(btn, 'click', tool.enable, this);
        L.DomEvent.on(btn, 'click', (e) => toggleExtra(e, tool), this);

        this.options.drawingBtns[key] = btn;
      });

      // this.options.drawingBtns.lineBtn = this.createToolbarBtn(
      //   'lineBtn',
      //   toolContainer,
      //   'Line',
      //   'fa fa-minus',
      //   true,
      // );
      // this.options.drawingBtns.markerBtn = this.createToolbarBtn(
      //   'markerBtn',
      //   toolContainer,
      //   'Marker',
      //   'fa fa-map-marker',
      //   true,
      // );
      // this.options.drawingBtns.polygonBtn = this.createToolbarBtn(
      //   'polygonBtn',
      //   toolContainer,
      //   'Polygon',
      //   'fa fa-star',
      //   true,
      // );

      // this.options.drawingBtns.deselectBtn = this.createToolbarBtn(
      //   'deselectBtn',
      //   toolContainer,
      //   'Deselect',
      //   'fa fa-star-half-o',
      // );

      // this.options.drawingBtns.transformBtn = this.createToolbarBtn(
      //   'transformBtn',
      //   toolContainer,
      //   'Transform',
      //   'fa fa-arrows-alt',
      // );

      // this.options.drawingBtns.editBtn = this.createToolbarBtn(
      //   'editBtn',
      //   toolContainer,
      //   'Edit',
      //   'fa fa-square',
      // );

      // this.options.drawingBtns.joinBtn = this.createToolbarBtn(
      //   'joinBtn',
      //   toolContainer,
      //   'Join',
      //   'fa fa-plus-circle',
      //   true,
      // );

      // this.options.drawingBtns.sliceBtn = this.createToolbarBtn(
      //   'sliceBtn',
      //   toolContainer,
      //   'Slice polygon',
      //   'fa fa-cutlery',
      //   true,
      // );

      // this.options.drawingBtns.divideBtn = this.createToolbarBtn(
      //   'divideBtn',
      //   toolContainer,
      //   'Divide polygon',
      //   'fa fa-scissors',
      //   true,
      // );

      // this.options.drawingBtns.connectBtn = this.createToolbarBtn(
      //   'connectBtn',
      //   toolContainer,
      //   'Connect',
      //   'fa fa-sitemap',
      //   true,
      // );

      // this.options.drawingBtns.searchBtn = this.createToolbarBtn(
      //   'searchBtn',
      //   toolContainer,
      //   'Search',
      //   'fa fa-search',
      // );

      // this.options.drawingBtns.paintBtn = this.createToolbarBtn(
      //   'paintBtn',
      //   toolContainer,
      //   'Paint',
      //   'fa fa-paint-brush',
      //   true,
      // );

      // this.options.drawingBtns.eraserBtn = this.createToolbarBtn(
      //   'eraseBtn',
      //   toolContainer,
      //   'Erase',
      //   'fa fa-eraser',
      //   true,
      // );

      // this.options.drawingBtns.removeBtn = this.createToolbarBtn(
      //   'removeBtn',
      //   toolContainer,
      //   'Remove',
      //   'fa fa-times',
      // );

      this.addEventListeners();
      L.DomEvent.disableClickPropagation(topContainer);
      return topContainer;
    },

    onRemove: function (map) {},

    /**
     * adds event listeners
     */
    addEventListeners: function () {
      const {
        lineBtn,
        markerBtn,
        polygonBtn,
        transformBtn,
        editBtn,
        sliceBtn,
        joinBtn,
        deselectBtn,
        connectBtn,
        searchBtn,
        paintBtn,
        eraserBtn,
        removeBtn,
        divideBtn,
      } = this.options.drawingBtns;
      const map = this.options.map;
      const sidebar = this.getSidebar();

      // // * on click disable transform/node edit if is active
      // const btnsArr = Object.values(this.options.drawingBtns);
      // btnsArr.forEach((btn) => {
      //   if (!btn.className.includes('transformBtn')) {
      //     L.DomEvent.on(btn, 'click', this._disableTransform, this);
      //   }
      //   if (!btn.className.includes('editBtn')) {
      //     L.DomEvent.on(btn, 'click', this._disableNodeEdit, this);
      //   }
      // });

      // // * toggles extra button for deactivating tool
      // const toggleExtra = (e) => {
      //   withExtra.forEach((btn) => btn.lastChild.classList.add('hide'));
      //   let extraBtn = e.target.lastChild;
      //   if (!extraBtn) extraBtn = e.target.nextSibling;
      //   extraBtn.classList.toggle('hide');
      //   L.DomEvent.on(extraBtn, 'click', this._disableDrawing, this);
      // };
      // const withExtra = [
      //   lineBtn,
      //   markerBtn,
      //   polygonBtn,
      //   connectBtn,
      //   sliceBtn,
      //   divideBtn,
      //   paintBtn,
      //   eraserBtn,
      //   joinBtn,
      // ];
      // withExtra.forEach((btn) => {
      //   L.DomEvent.on(btn, 'click', toggleExtra, this);
      // });

      // L.DomEvent.on(lineBtn, 'click', () => this.initCreatePolyline(map, sidebar), this);
      // L.DomEvent.on(markerBtn, 'click', L.DomEvent.stopPropagation)
      //   .on(markerBtn, 'click', L.DomEvent.preventDefault)
      //   .on(markerBtn, 'click', () => this.initCreateMarker(map, sidebar), this);
      // L.DomEvent.on(polygonBtn, 'click', () => this.initCreatePolygon(map, sidebar), this);
      // L.DomEvent.on(transformBtn, 'click', this.initTransform, this);
      // L.DomEvent.on(editBtn, 'click', this.initNodeEdit, this);
      // L.DomEvent.on(sliceBtn, 'click', () => this.initSlicePoly(map, sidebar), this);
      // L.DomEvent.on(divideBtn, 'click', () => this.initDividePoly(map, sidebar), this);
      // L.DomEvent.on(deselectBtn, 'click', this.deselect, this);
      // L.DomEvent.on(joinBtn, 'click', this.initJoin, this);
      // L.DomEvent.on(connectBtn, 'click', L.DomEvent.stopPropagation)
      //   .on(connectBtn, 'click', L.DomEvent.preventDefault)
      //   .on(connectBtn, 'click', () => this.initConnect(map, sidebar), this);
      // L.DomEvent.on(searchBtn, 'click', this.initSearch, this);
      // L.DomEvent.on(paintBtn, 'click', this.initPainting, this);
      // L.DomEvent.on(eraserBtn, 'click', this.initErasing, this);
      // L.DomEvent.on(removeBtn, 'click', this.initRemove, this);
    },

    /**
     * called when user wants to select multiple geo. objects
     *
     * @param {Object} evt
     */
    initJoin: function (evt) {
      const sidebar = this.getSidebar();
      const init = this.options.tool.initSelecting;
      init();
      sidebar.getState().setEnabledEl({
        enable: init,
        disable: () => {
          init();
          this.options.tool.getState().deselectChosenLayers();
        },
      });
    },

    /**
     * enables topology creation
     *
     * @param {Object} map
     * @param {Object} sidebar
     */
    initConnect: function (map, sidebar) {
      this.redrawSidebar('marker', true);
      connectClick(map, sidebar);
    },

    /**
     * removes geo. object
     *
     * @param {Object} evt
     */
    initRemove: function (evt) {
      this.options.tool.removeElement();
    },

    /**
     * enables erasing of polygons
     *
     * @param {Object} evt
     */
    initErasing: function (evt) {
      let sidebar = this.getSidebar();
      let paintPoly = sidebar.getState().paintPoly;
      sidebar.getState().paintPoly.erase(evt);

      sidebar
        .getState()
        .setEnabledEl({ enable: paintPoly.enableErase, disable: paintPoly.disable });
      this.redrawSidebar(null);
    },

    /**
     * enables brush tool
     *
     * @param {Object} e
     */
    initPainting: function (e) {
      let sidebar = this.getSidebar();
      let paintPoly = sidebar.getState().paintPoly;
      sidebar.getState().paintPoly.clickDraw(e);

      sidebar
        .getState()
        .setEnabledEl({ enable: paintPoly.enablePaint, disable: paintPoly.disable });
      this.redrawSidebar('painted');
    },

    /**
     * enables search
     */
    initSearch: function () {
      this.options.tool.search();
    },

    /**
     * enables creating polylines
     *
     * @param {Object} map
     * @param {Object} sidebar
     */
    initCreatePolyline: function (map, sidebar) {
      this.redrawSidebar('polyline');
      polylineCreate(map, sidebar);
    },
    /**
     * enables creating polygons
     *
     * @param {Object} map
     * @param {Object} sidebar
     */
    initCreatePolygon: function (map, sidebar) {
      this.redrawSidebar('polygon');
      polygonCreate(map, sidebar);
    },
    /**
     * enables creating markers
     *
     * @param {Object} map
     * @param {Object} sidebar
     */
    initCreateMarker: function (map, sidebar) {
      this.redrawSidebar('marker', true);
      markerCreate(map, sidebar);
    },
    /**
     * enables freehand slicing
     *
     * @param {Object} map
     * @param {Object} sidebar
     */
    initSlicePoly: function (map, sidebar) {
      this.redrawSidebar(null);
      slicePoly(map, sidebar);
    },
    /**
     * enables angular slicing
     *
     * @param {Object} map
     * @param {Object} sidebar
     */
    initDividePoly: function (map, sidebar) {
      this.redrawSidebar(null);
      dividePoly(map, sidebar);
    },

    /**
     * deselects geo.object
     */
    deselect: function () {
      const selected = this.getSelectedEl();

      if (selected?.editing?._enabled) {
        selected.editing.disable();
      }
      if (selected) {
        this.options.tool.normalizeElement(selected);
        this.options.tool.initNodeEdit(true);
        this.options.tool.getState().clearSelectedLayer();
        this.redrawSidebar();
        document.querySelector('.leaflet-container').style.cursor = '';
      }
    },

    /**
     * disables enabled tool (markers, polylines, polygons, brush tool, eraser)
     *
     * @param {Object} e
     */
    _disableDrawing: function (e, tool) {
      e.stopPropagation();
      e?.target?.classList?.toggle('hide');
      tool.disable();
    },

    /**
     * disables transform of selected geo. object
     */
    _disableTransform: function () {
      const layer = this.getSelectedEl();

      if (layer?.transform?._enabled) {
        layer.transform.disable();
        layer.dragging.disable();
        let paintPoly = this.getSidebar().getState().paintPoly;
        paintPoly.updatePaintedPolys(layer.kIdx, layer);
      }
    },

    /**
     * enables/disables node edit, depending on if it's active or not
     */
    initNodeEdit: function () {
      this.options.tool.initNodeEdit();
    },

    /**
     * disables node edit
     */
    _disableNodeEdit: function () {
      this.options.tool.initNodeEdit(true);
    },

    /**
     * enables/disables tranform, depending on if it's active or not
     */
    initTransform: function () {
      const selected = this.getSelectedEl();

      this.options.tool.initTransform(selected);
    },

    /**
     * creates toolbar button
     *
     * @param {String} className
     * @param {Object} btnContainer
     * @param {String} title
     * @param {String} icon
     * @param {Boolean} extra
     * @returns button to put into toolbar
     */
    createToolbarBtn: function (className, btnContainer, title, icon, extra = false) {
      const returnBtn = L.DomUtil.create('a', `${className} d-side-button`, btnContainer);
      returnBtn.title = title;
      returnBtn.innerHTML = `<i class="${icon}" aria-hidden="true"></i>`;
      returnBtn.role = 'button';
      if (extra) {
        const extraBtn = L.DomUtil.create('a', 'extra-btn hide', returnBtn);
        extraBtn.innerHTML = `Cancel`;
        extraBtn.role = 'button';
      }
      return returnBtn;
    },

    /**
     *
     * @returns currently selected geo. object
     */
    getSelectedEl: function () {
      return this.options.tool.getState().selectedLayer;
    },

    /**
     * redraws sidebar depending on val argument
     *
     * @param {string} val
     * @param {Boolean} enabled
     */
    redrawSidebar: function (val, enabled = false) {
      this.options.tool.redrawSidebarTabControl(val, enabled);
    },

    /**
     *
     * @returns sidebar object
     */
    getSidebar: function () {
      return this.options.tool.getSidebarTabControl();
    },
  });

  L.control.drawingToolbar = function (options) {
    if (!options) {
      options = {};
    }
    return new L.Control.DrawingToolbar(options);
  };
}

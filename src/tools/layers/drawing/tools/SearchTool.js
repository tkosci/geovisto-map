import React from 'react';
import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import AbstractTool from './AbstractTool';

class SearchTool extends AbstractTool {
  constructor(props) {
    super(props);
  }

  static NAME(): string {
    return 'search-drawing-tool';
  }

  getName(): string {
    return SearchTool.NAME();
  }

  getIconName(): string {
    return 'fa fa-search';
  }

  getTitle(): string {
    return 'Search drawing tool';
  }

  result = (): string => {
    return 'search';
  };

  enable = (): void => {
    this._redrawSidebar(this.result());
  };
}

export default SearchTool;

import { TSearchControlState } from './types';
import { ControlProps } from './../AbstractControl/types';
import SidebarInputFactory from '../../../../../../inputs/SidebarInputFactory';
import { createCheck } from '../../../util/inputs';
import { ADMIN_LEVELS } from '../../../util/constants';
import AbstractControl from '../AbstractControl/AbstractControl';
import SearchControlState from './SearchControlState';
import AbstractSidebarInput from '../../../../../../inputs/AbstractSidebarInput';
import AutocompleteSidebarInput from '../../../../../../inputs/input/AutocompleteSidebarInput';

class SearchControl extends AbstractControl {
  private state: TSearchControlState;
  public inputSearch: AbstractSidebarInput | AutocompleteSidebarInput | null;
  public inputConnect: HTMLDivElement | null;
  public errorMsg: HTMLDivElement | null;
  public searchForAreasBtn: HTMLButtonElement | null;

  constructor(props: ControlProps) {
    super();

    this.state = new SearchControlState({ tabControl: props.tabControl, control: this });

    this.inputSearch = null;
    this.inputConnect = null;
    this.errorMsg = null;
    this.searchForAreasBtn = null;
  }

  /**
   * checkbox to be able to create topology with place search
   */
  createConnectCheck = (): HTMLDivElement => {
    const onChange = (val: boolean) => this.state.setConnectActivated(val);
    const { connectActivated } = this.state;

    const result = createCheck(
      connectActivated,
      onChange,
      'connect',
      'By creating new marker while having this choice selected, you will create path between newly created marker and selected marker or last created marker via Topology tool',
    );

    return result;
  };

  /**
   * checkbox to set if result of area search will be HQ
   */
  createHighQualityCheck = (): HTMLDivElement => {
    const onChange = (val: boolean) => this.state.setHighQuality(val);
    const { highQuality } = this.state;

    const result = createCheck(
      highQuality,
      onChange,
      'high-quality',
      'By selecting the option displayed polygons will be in higher quality, which however means that some operations will take longer to execute',
    );
    return result;
  };

  /**
   * creates heading element
   */
  addHeading = (title: string, elem: HTMLDivElement): void => {
    const headingTag = document.createElement('h3');
    headingTag.innerText = title;
    elem.appendChild(headingTag);
  };

  /**
   * creates all of the search inputs
   *
   * @param {Object} elem HTML element wrapper
   * @param {Object} model
   */
  renderSearchInputs = (elem: HTMLDivElement, model: any): void => {
    this.addHeading('Search for place', elem);
    // * labeled text Search
    this.inputSearch = SidebarInputFactory.createSidebarInput(model.search.input, {
      label: model.search.label,
      action: this.state.searchAction,
      options: [],
      placeholder: 'Press enter for search',
      setData: this.state.onInputOptClick,
    });
    elem.appendChild(this.inputSearch.create() as Node);

    this.inputConnect = this.createConnectCheck();
    elem.appendChild(this.inputConnect);
    // * divider
    elem.appendChild(document.createElement('hr'));

    this.addHeading('Search for area', elem);
    // * labeled text Search
    const inputSearchForArea = SidebarInputFactory.createSidebarInput(model.searchForArea.input, {
      label: model.searchForArea.label,
      options: this.state.getSelectCountries(),
      action: this.state.searchForAreaAction,
      value: this.state.countryCode || '',
    });
    elem.appendChild(inputSearchForArea.create() as Node);

    const inputAdminLevel = SidebarInputFactory.createSidebarInput(model.adminLevel.input, {
      label: model.adminLevel.label,
      options: ADMIN_LEVELS,
      action: this.state.pickAdminLevelAction,
      value: this.state.adminLevel,
    });
    elem.appendChild(inputAdminLevel.create() as Node);

    const hqCheck = this.createHighQualityCheck();
    elem.appendChild(hqCheck);

    this.errorMsg = document.createElement('div');
    this.errorMsg.className = 'error-text';
    this.errorMsg.innerText = '';
    elem.appendChild(this.errorMsg);

    this.searchForAreasBtn = document.createElement('button');
    this.searchForAreasBtn.innerText = 'Submit';
    this.searchForAreasBtn.addEventListener('click', this.state.fetchAreas);
    elem.appendChild(this.searchForAreasBtn);
  };
}

export default SearchControl;

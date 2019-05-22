import React, {Component} from 'react';
import {connect} from "react-redux";
import {AddButton, Loader, PageTitle, PrivatePageRedirect, SkillsForm, Tooltip} from "../../components";
import {DetailsList, DetailsListLayoutMode,} from 'office-ui-fabric-react/lib/DetailsList';
import {deleteUserSkill, getUserSkills} from "../../actions/userSkills";
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  IconButton,
  Panel,
  PanelType,
  PrimaryButton,
  Rating,
  SelectionMode,
  Icon,
} from "office-ui-fabric-react";
import {getSkills} from "../../actions/skills";
import {getEmployee} from "../../actions/user";
import ReactPaginate from 'react-paginate';
import { Paginator } from '../../service/utils';

class SkillsPage extends Component {

  editSkill(skill) {
    this.setState({skillToEdit: skill, showPanel: true})
  }

  deleteSkill(skillId) {
    const {employee, deleteSkill} = this.props;
    deleteSkill(employee.id, skillId);
  }

  _openDeleteDialog(skill) {
    this.setState({skillToDelete: skill, hideDialog: false})
  }

  _setSkillsToShow(pageNumber) {
    this.setState({ skillsToShow: this.Paginator.getCurrentPage(pageNumber), pageNumber });
  }

  handlePageClick({ selected }) {
    this._setSkillsToShow(selected)
  }

  _columns = [
    {
      key: 'skillName',
      name: 'Skill Name',
      fieldName: 'skill.name',
      minWidth: 210,
      maxWidth: 350,
      isRowHeader: true,
      isResizable: true,
      isPadded: true,
      onRender: ({skill}) => {
        return <span>{skill.name}</span>;
      },
    },
    {
      key: 'level',
      name: 'Level',
      fieldName: 'level',
      minWidth: 70,
      maxWidth: 100,
      isResizable: true,
      isPadded: true,
      onRender: ({level}) => {
        return (<div>
          <Rating
            id={'readOnlyRatingStar'}
            min={1}
            max={5}
            rating={level}
            readOnly={true}
          />
        </div>);
      },
    }, {
      key: 'projectsCount',
      name: 'No. of projects',
      fieldName: 'projectsCount',
      minWidth: 40,
      maxWidth: 60,
      isResizable: false,
      isPadded: true,
      onRender: ({projectsCount}) => {
        return (<div style={{textAlign: 'center'}}>
          {projectsCount}
        </div>);
      },
    },
    {
      key: 'description',
      name: 'Description',
      fieldName: 'description',
      minWidth: 150,
      maxWidth: 350,
      isResizable: true,
      data: 'string',
      onRender: ({description}) => {
        return <Tooltip text={description}>{description}</Tooltip>;
      },
      isPadded: true
    },
    {
      key: 'actions',
      name: 'Actions',
      fieldName: 'skills',
      minWidth: 50,
      maxWidth: 50,
      onRender: (item) => {
        return (<IconButton
          style={{height: 'auto'}}
          allowDisabledFocus={true}
          menuIcon={{iconName: 'MoreVertical'}}
          menuProps={{
            items: [
              {
                key: 'edit',
                text: 'Edit',
                iconProps: {iconName: 'Edit', style: {color: '#000'}},
                onClick: () => this.editSkill(item)
              },
              {
                key: 'delete',
                text: 'Delete',
                iconProps: {iconName: 'Delete', style: {color: '#000'}},
                onClick: () => this._openDeleteDialog(item)
              }

            ],
            directionalHintFixed: true
          }}
          split={false}
        />);
      },
      isPadded: true
    }
  ];

  state = {
    showPanel: false,
    hideDialog: true,
    skillToDelete: null,
    skillToEdit: null,
    skillsToShow: [],
    pageNumber: 0,
  };

  Paginator = new Paginator(this.props.userSkills);

  componentDidMount() {
    const {user, getUserSkills, skills, getSkills, employeeId, getEmployee} = this.props;
    if (user) {
      getEmployee(employeeId);
      getUserSkills(employeeId);
      if (!skills)
        getSkills();
    }
    this._setSkillsToShow(this.state.pageNumber);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {userSkills, editUserSkillState} = this.props;

    if (nextProps.userSkills) {
      this.Paginator.array = nextProps.userSkills;
      this._setSkillsToShow(this.state.pageNumber);
    }

    if ((userSkills && nextProps.userSkills && (userSkills.length !== nextProps.userSkills.length)) ||
      ((editUserSkillState && this.state.skillToEdit) &&
        (editUserSkillState === this.state.skillToEdit.id))) {
      const {showPanel, hideDialog} = this.state;
      !hideDialog && this._closeDialog();
      showPanel && this._setShowPanel(false)();
    }

    const {getUserSkills, employeeId, getEmployee} = this.props;
    const {employeeId: nextId} = nextProps;
    if ((nextId !== employeeId)) {
      getEmployee(nextId);
      getUserSkills(nextId)
    }
  }

  render() {
    const {skillToEdit, showPanel, hideDialog, skillToDelete} = this.state;
    return (
      <div className={'page-container'}>
        <PrivatePageRedirect employeeId={this.props.employeeId}/>
        <PageTitle title="Skills"/>
        <div className={'add-button'}>
          <AddButton disabled={showPanel} title="Add a Skill" onClick={this._setShowPanel(true)}/>
          <Panel
            isBlocking={false}
            isOpen={showPanel}
            onDismiss={this._setShowPanel(false)}
            type={PanelType.smallFixedFar}
            headerText={!skillToEdit ? 'Add a Skill' : 'Edit a skill'}
            hasCloseButton={false}
          >
            <SkillsForm onClose={this._setShowPanel(false)} userSkill={skillToEdit}/>
          </Panel>
        </div>
        {
          this.props.userSkills ?
            <div>
            <DetailsList
              items={this.state.skillsToShow}
              columns={this._columns}
              selectionMode={SelectionMode.none}
              layoutMode={DetailsListLayoutMode.justified}
            />
              <ReactPaginate
                previousLabel={(() => (<Icon iconName="ChevronLeft"/>))()}
                nextLabel={(() => (<Icon iconName="ChevronRight"/>))()}
                breakLabel={'...'}
                pageCount={this.Paginator.getPagesCount()}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={this.handlePageClick.bind(this)}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
              />
            </div>:
            <Loader title="Loading your skills..."/>
        }
        <Dialog
          hidden={hideDialog}
          onDismiss={this._closeDialog}
          dialogContentProps={{
            type: DialogType.normal,
            title: `Delete skill ${skillToDelete && skillToDelete.skill.name}`,
            subText:
              'This can not be undone. Your skill will be deleted from all your projects.'
          }}
          modalProps={{
            titleAriaId: 'myLabelId',
            subtitleAriaId: 'mySubTextId',
            isBlocking: false
          }}
        >
          <DialogFooter>
            <PrimaryButton
              iconProps={{iconName: 'Delete'}}
              onClick={() => {
                this.deleteSkill(skillToDelete.id);
              }} text="Delete"/>
            <DefaultButton onClick={this._closeDialog} text="Cancel"/>
          </DialogFooter>
        </Dialog>
      </div>
    );
  }

  _closeDialog = () => {
    this.setState({hideDialog: true});
  };

  _setShowPanel = (showPanel) => {
    return () => {
      this.setState({skillToEdit: null, showPanel});
    };
  };
}

const mapStateToProps = ({user, userSkills, skills, editUserSkillState, employee, isStaff}, {match: {params: {employeeId}}}) => {
  return {user, userSkills, skills, editUserSkillState, employeeId, employee, isStaff};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserSkills: (userId) => dispatch(getUserSkills(userId)),
    getSkills: () => dispatch(getSkills()),
    deleteSkill: (userId, skillId) => dispatch(deleteUserSkill(userId, skillId)),
    getEmployee: (userId) => dispatch(getEmployee(userId)),
  };
};

export const EmployeeSkills = connect(mapStateToProps, mapDispatchToProps)(SkillsPage);
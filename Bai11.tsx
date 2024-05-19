import React, { Component } from 'react';
import Bai11Con from './Bai11Con';

type Props = {};
type State = {
  show: boolean,
  isEditing: boolean,
  inputValue: string,
  jobs: Job[],
  jobToEdit: Job | null,
  jobToDelete: Job | null,
  editInputValue: string,
};
type Job = {
  id: number,
  name: string,
  status: boolean,
};
export default class Bai11 extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      show: false,
      isEditing: false,
      inputValue: '',
      jobs: [],
      jobToEdit: null,
      jobToDelete: null,
      editInputValue: '',
    };
  }
  componentDidMount(): void {
    const jobLocal = localStorage.getItem('jobs');
    this.setState({
      jobs: jobLocal ? JSON.parse(jobLocal) : [],
    });
  }
  handleAddJob = () => {
    const { inputValue, jobs } = this.state;
    if (!inputValue.trim()) {
      alert('Vui lòng nhập công việc');
      return;
    }
    if (jobs.some(job => job.name === inputValue.trim())) {
      alert('Tên công việc không được phép trùng');
      return;
    }
    const newJob: Job = {
      id: Math.ceil(Math.random() * 1000000000),
      name: inputValue.trim(),
      status: false,
    };
    const updatedJobs = [...jobs, newJob];
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    this.setState({
      jobs: updatedJobs,
      inputValue: '',
    });
  };
  handleEditJob = () => {
    const { editInputValue, jobs, jobToEdit } = this.state;
    if (!editInputValue.trim()) {
      alert('Vui lòng nhập công việc');
      return;
    }
    if (jobs.some(job => job.name === editInputValue.trim() && job.id !== jobToEdit?.id)) {
      alert('Tên công việc không được phép trùng');
      return;
    }
    const updatedJobs = jobs.map(job =>
      job.id === jobToEdit?.id ? { ...job, name: editInputValue.trim() } : job
    );
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    this.setState({
      jobs: updatedJobs,
      editInputValue: '',
      show: false,
      jobToEdit: null,
      isEditing: false,
    });
  };
  handleDeleteJob = () => {
    const { jobs, jobToDelete } = this.state;
    if (jobToDelete) {
      const updatedJobs = jobs.filter(job => job.id !== jobToDelete.id);
      localStorage.setItem('jobs', JSON.stringify(updatedJobs));
      this.setState({ jobs: updatedJobs, show: false, jobToDelete: null });
    }
  };
  toggleJobStatus = (id: number) => {
    const updatedJobs = this.state.jobs.map(job =>
      job.id === id ? { ...job, status: !job.status } : job
    );
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    this.setState({ jobs: updatedJobs });
  };
  openModal = (job: Job | null, isEditing: boolean) => {
    this.setState({
      show: true,
      isEditing,
      jobToEdit: isEditing ? job : null,
      jobToDelete: !isEditing ? job : null,
      editInputValue: job ? job.name : '',
    });
  };
  closeModal = () => {
    this.setState({
      show: false,
      jobToEdit: null,
      jobToDelete: null,
      isEditing: false,
      inputValue: '',
      editInputValue: '',
    });
  };
  render() {
    const { show, isEditing, inputValue, jobs, editInputValue } = this.state;
    const completedJobs = jobs.filter(job => job.status).length;
    const allJobsCompleted = completedJobs === jobs.length && jobs.length > 0;
    return (
      <div className='body'>
        <div className='body-son'>
          <h2 className='h2'>Danh sách công việc</h2>
          <div>
            <input
              className='input-index'
              type="text"
              value={inputValue}
              onChange={(e) => this.setState({ inputValue: e.target.value })}
            />
            <button className='button-add' onClick={isEditing ? this.handleEditJob : this.handleAddJob}>
              {isEditing ? 'Sửa' : 'Thêm'}
            </button>
          </div>
          <div>
            <ul>
              {jobs.map(job => (
                <li key={job.id}>
                  <input
                    type="checkbox"
                    checked={job.status}
                    onChange={() => this.toggleJobStatus(job.id)}
                  />
                  <span style={{ textDecoration: job.status ? 'line-through' : 'none' }}>
                    {job.name}
                  </span>
                  <button onClick={() => this.openModal(job, true)}>Sửa</button>
                  <button onClick={() => this.openModal(job, false)}>Xóa</button>
                </li>
              ))}
            </ul>
          </div>
          {allJobsCompleted && <p>Hoàn thành công việc</p>}
          {show && (
            <Bai11Con
              title={isEditing ? "Sửa công việc" : "Xác nhận xóa"}
              content={isEditing ? "Vui lòng chỉnh sửa công việc." : "Bạn có chắc chắn muốn xóa công việc này không?"}
              close={this.closeModal}
              confirm={isEditing ? this.handleEditJob : this.handleDeleteJob}
              editInputValue={editInputValue}
              onEditInputChange={(e) => this.setState({ editInputValue: e.target.value })}
              isEditing={isEditing}
            />
          )}
        </div>
      </div>
    );
  }
}
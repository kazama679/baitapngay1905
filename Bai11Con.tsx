import React, { Component } from 'react';
import { CloseOutlined } from '@ant-design/icons';

type State = {};
type Props = {
  title: string,
  content: string,
  close: () => void,
  confirm: () => void,
  editInputValue: string,
  onEditInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  isEditing: boolean,
};
export default class Bai11Con extends Component<Props, State> {
  render() {
    const { title, content, close, confirm, editInputValue, onEditInputChange, isEditing } = this.props;
    return (
      <div className="overlay">
        <div className='modal-container'>
          <header className='modal-header'>
            <h3>{title}</h3>
            <CloseOutlined onClick={close} />
          </header>
          <main className='modal-main'>
            <p>{content}</p>
            {isEditing && (
              <input
                type="text"
                value={editInputValue}
                onChange={onEditInputChange}
              />
            )}
          </main>
          <footer className='modal-footer'>
            <button className='button' onClick={close}>Hủy</button>
            <button className='button button-delete' onClick={confirm}>{isEditing ? 'Lưu' : 'Xóa'}</button>
          </footer>
        </div>
      </div>
    );
  }
}
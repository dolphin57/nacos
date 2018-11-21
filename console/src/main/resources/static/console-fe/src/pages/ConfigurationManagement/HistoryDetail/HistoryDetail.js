/*
 * Copyright 1999-2018 Alibaba Group Holding Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *      http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Field, Form, Input } from '@alifd/next';
import { getParams, request, aliwareIntl } from '../../../globalLib';

import './index.scss';

class HistoryDetail extends React.Component {
  static propTypes = {
    history: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      showmore: false,
    };
    this.edasAppName = getParams('edasAppName');
    this.edasAppId = getParams('edasAppId');
    this.inApp = this.edasAppName;
    this.field = new Field(this);
    this.dataId = getParams('dataId') || 'yanlin';
    this.group = getParams('group') || 'DEFAULT_GROUP';
    this.serverId = getParams('serverId') || 'center';
    this.nid = getParams('nid') || '123509854';
    this.tenant = getParams('namespace') || ''; // 为当前实例保存tenant参数
    // this.params = window.location.hash.split('?')[1]||'';
    this.typeMap = {
      U: aliwareIntl.get('com.alibaba.nacos.page.historyDetail.update'),
      I: aliwareIntl.get('com.alibaba.nacos.page.historyDetail.insert'),
      D: aliwareIntl.get('com.alibaba.nacos.page.historyDetail.delete'),
    };
  }

  componentDidMount() {
    this.getDataDetail();
  }

  toggleMore() {
    this.setState({
      showmore: !this.state.showmore,
    });
  }

  getDataDetail() {
    const self = this;

    request({
      url: `v1/cs/history?dataId=${this.dataId}&group=${this.group}&nid=${this.nid}`,
      success(result) {
        if (result != null) {
          const data = result;
          self.field.setValue('dataId', data.dataId);
          self.field.setValue('content', data.content);
          self.field.setValue('appName', self.inApp ? self.edasAppName : data.appName);
          self.field.setValue('envs', self.serverId);
          self.field.setValue('opType', self.typeMap[data.opType.trim()]);
          self.field.setValue('group', data.group);
          self.field.setValue('md5', data.md5);
        }
      },
    });
  }

  goList() {
    this.props.history.push(
      `/historyRollback?serverId=${this.serverId}&group=${this.group}&dataId=${
        this.dataId
      }&namespace=${this.tenant}`
    );
  }

  render() {
    const { init } = this.field;
    const formItemLayout = {
      labelCol: {
        fixedSpan: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    return (
      <div style={{ padding: 10 }}>
        <h1>{aliwareIntl.get('com.alibaba.nacos.page.historyDetail.history_details')}</h1>
        <Form field={this.field}>
          <Form.Item label="Data ID:" required {...formItemLayout}>
            <Input htmlType="text" readOnly {...init('dataId')} />
            <div style={{ marginTop: 10 }}>
              <a style={{ fontSize: '12px' }} onClick={this.toggleMore.bind(this)}>
                {this.state.showmore
                  ? aliwareIntl.get('com.alibaba.nacos.page.historyDetail.recipient_from')
                  : aliwareIntl.get('com.alibaba.nacos.page.historyDetail.more_advanced_options')}
              </a>
            </div>
          </Form.Item>
          <div style={{ overflow: 'hidden', height: this.state.showmore ? 'auto' : '0' }}>
            <Form.Item label="Group:" required {...formItemLayout}>
              <Input htmlType="text" readOnly {...init('group')} />
            </Form.Item>
            <Form.Item
              label={aliwareIntl.get('com.alibaba.nacos.page.historyDetail.home')}
              {...formItemLayout}
            >
              <Input htmlType="text" readOnly {...init('appName')} />
            </Form.Item>
          </div>
          <Form.Item
            label={aliwareIntl.get('com.alibaba.nacos.page.historyDetail.action_type')}
            required
            {...formItemLayout}
          >
            <Input htmlType="text" readOnly {...init('opType')} />
          </Form.Item>
          <Form.Item label="MD5:" required {...formItemLayout}>
            <Input htmlType="text" readOnly {...init('md5')} />
          </Form.Item>
          <Form.Item
            label={aliwareIntl.get('com.alibaba.nacos.page.historyDetail.configure_content')}
            required
            {...formItemLayout}
          >
            <Input.TextArea htmlType="text" multiple rows={15} readOnly {...init('content')} />
          </Form.Item>
          <Form.Item label=" " {...formItemLayout}>
            <Button type="primary" onClick={this.goList.bind(this)}>
              {aliwareIntl.get('com.alibaba.nacos.page.historyDetail.return')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default HistoryDetail;
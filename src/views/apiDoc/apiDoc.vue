<template>
  <div class="api-container">
    <!-- <div class="left-tabbar">
      左边的导航菜单
    </div>
    <div class="right-content-a">
      右边的内容
    </div> -->
    <div class="left-tabbar">
      <el-menu :default-active="activeIndex" :unique-opened="true" @select="handleSelect" class="el-menu-vertical-demo">
        <!-- 一级菜单 -->
        <template v-for="item in menuTab">
          <el-submenu v-if="item.children && item.children.length" :index="item.path" :key="item.path">
            <template slot="title">
              <span>{{ item.name }}</span>
            </template>
            <!-- 二级菜单 -->
            <template v-for="itemChild in item.children">
              <el-submenu v-if="itemChild.children && itemChild.children.length" :key="itemChild.path" :index="itemChild.path">
                <template slot="title">
                  <span>{{ itemChild.name }}</span>
                </template>
                <!-- 三级菜单 -->
                <el-menu-item v-for="itemChild_child in itemChild.children" :index="itemChild_child.path" :key="itemChild_child.path" @click.native="handlechange(itemChild_child)">
                  <span>{{ itemChild_child.name }}</span>
                </el-menu-item>
              </el-submenu>
              <!-- 二级菜单没有子 -->
              <el-menu-item v-else :index="itemChild.path" :key="itemChild.path" @click.native="handlechange(itemChild)">
                <span slot="title">{{ itemChild.name }}</span>
              </el-menu-item>
            </template>
          </el-submenu>
          <!-- 一级菜单 -->
          <el-menu-item v-else :index="item.path" :key="item.path" @click.native="handlechange(item)">
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <!-- 右边的内容 -->
    <div class="right-content-api">
      <div class="top-title">
        {{ currentTab.name }}
      </div>
      <div class="api-content" v-if="currentTab.path == '/1'">
        <div class="t1">接口简介</div>
        <div class="content">
          爱车易平台API接口旨在为第三方平台提供包含设备基本信息、状态信息、位置信息、里程信息、行程信息、流量卡信息、指令下发等服务。其中包含第三方平台请求接口和爱车易平台推送接口
        </div>
        <div class="t1">修订记录</div>
        <div class="content">
          <!-- <a href="http://test.basegps.com/openApi.docx">点击此处获取最新文档</a> -->
          <div class="main-table">
            <t-table>
              <template slot="table-head">
                <th width="200px">发布日期</th>
                <th width="200px">版本号</th>
                <th width="200px">修改说明</th>
              </template>
              <template slot="table-body">
                <tr>
                  <td width="200px">2020-12</td>
                  <td width="200px">V1.0</td>
                  <td width="200px">第一次发布</td>
                </tr>
                <tr>
                  <td width="200px">2021-05</td>
                  <td width="200px">V1.1</td>
                  <td width="200px">推送接口添加定位精度、高度等信息</td>
                </tr>
              </template>
            </t-table>
          </div>
        </div>
        <div class="t2">编码</div>
        <div class="content">
          接口编码默认为UTF-8,如果请求参数包含中文，必须使用UTF-8编码方式
        </div>
      </div>
      <!-- 2 -->
      <div class="api-content" v-if="currentTab.path == '/2'">
        <div class="t1">API规格</div>
        <div class="t2">公共请求消息头</div>
        <div class="content">
          <t-table>
            <template slot="table-head">
              <th width="200px">消息头(header)</th>
              <th width="200px">是否必须</th>
              <th width="200px">说明</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">Content-Type</td>
                <td width="200px">是</td>
                <td width="200px">application/json; charset=utf-8</td>
              </tr>
            </template>
          </t-table>
        </div>
        <div class="t1">公共响应消息头</div>
        <div class="content">
          <t-table>
            <template slot="table-head">
              <th width="200px">消息头(header)</th>
              <th width="200px">是否必须</th>
              <th width="200px">说明</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">Content-Type</td>
                <td width="200px">是</td>
                <td width="200px">application/json; charset=utf-8</td>
              </tr>
            </template>
          </t-table>
        </div>
        <div class="t1">公共返回格式</div>
        <div class="content">
          <t-table>
            <template slot="table-head">
              <th width="200px">参数名</th>
              <th width="200px">类型</th>
              <th width="200px">说明</th>
              <th width="200px">备注</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">retCode</td>
                <td width="200px">int</td>
                <td width="200px">返回状态码</td>
                <td width="200px">1为请求成功。异常值见错误码</td>
              </tr>
              <tr>
                <td width="200px">retMsg</td>
                <td width="200px">string</td>
                <td width="200px">返回值描述</td>
                <td width="200px">默认值success。异常值见错误码</td>
              </tr>
              <tr>
                <td width="200px">result</td>
                <td width="200px">string</td>
                <td width="200px">Json对象或数组</td>
                <td width="200px">用于获取响应结果集</td>
              </tr>
            </template>
          </t-table>
        </div>
      </div>
      <!-- 3 -->
      <div class="api-content" v-if="currentTab.path == '/3'">
        <div class="t1">开放接口使用步骤</div>
        <div class="content">
          <div class="t2">一、调用接口</div>
          <p>说明: 调用接口为第三方平台主动发起接口调用</p>
          <p>1.第三方平台先向爱车易平台申请接口调用ID和私钥</p>
          <p>2.第三方平台向爱车易平台提供请求白名单IP地址</p>
          <p>3.通过用户ID调用access接口获取请求凭证accesstoken信息</p>
          <p>3. 第三方平台通过凭证调用业务接口获取设备详细信息</p>
          <div class="t2">二、推送接口</div>
          <p>说明: 推送接口为爱车易平台实时推送到第三方接口</p>
          <p>1. 第三方平台先在爱车易平台申请登陆账号信息</p>
          <p>2. 爱车易平台为登陆账号开通接口推送权限</p>
          <p>3. 第三方转移所有设备到需要推送的用户或子用户下</p>
          <p>4. 第三方添加爱车易平台白名单IP地址</p>
          <p>5. 第三方提供接收推送信息的相关接口地址</p>
          <p>6. 爱车易平台推送设备信息到指定用户下</p>
        </div>
      </div>
      <!-- 4 -->
      <div class="api-content" v-if="currentTab.path == '/4'">
        <div class="t1">业务类错误码</div>
        <div class="content">
          <t-table>
            <template slot="table-head">
              <th width="300px">retCode</th>
              <th width="400px">retMsg</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="300px">4000</td>
                <td width="400px">无可用结果返回</td>
              </tr>
              <tr>
                <td width="300px">4001</td>
                <td width="400px">用户不存在</td>
              </tr>
              <tr>
                <td width="300px">4002</td>
                <td width="400px">设备号不存在</td>
              </tr>
              <tr>
                <td width="300px">4003</td>
                <td width="400px">无权限查看该账号</td>
              </tr>
              <tr>
                <td width="300px">4004</td>
                <td width="400px">请求设备上限</td>
              </tr>
              <tr>
                <td width="300px">4005</td>
                <td width="400px">设备号有误或不属于该账号</td>
              </tr>
              <tr>
                <td width="300px">4006</td>
                <td width="400px">缺少必要参数</td>
              </tr>
              <tr>
                <td width="300px">4007</td>
                <td width="400px">参数值非法</td>
              </tr>
              <tr>
                <td width="300px">4008</td>
                <td width="400px">请求参数异常</td>
              </tr>
              <tr>
                <td width="300px">4009</td>
                <td width="400px">用户权限未开通</td>
              </tr>
              <tr>
                <td width="300px">4010</td>
                <td width="400px">查询时间间隔过大</td>
              </tr>
              <tr>
                <td width="300px">4011</td>
                <td width="400px">查询时间超出最大时间</td>
              </tr>
            </template>
          </t-table>
        </div>
        <div class="t1">系统类错误码</div>
        <div class="content">
          <t-table>
            <template slot="table-head">
              <th width="300px">retCode</th>
              <th width="400px">retMsg</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="300px">5000</td>
                <td width="400px">服务器异常,请联系管理员</td>
              </tr>
              <tr>
                <td width="300px">5001</td>
                <td width="400px">系统异常,请联系管理员</td>
              </tr>
              <tr>
                <td width="300px">5002</td>
                <td width="400px">请求的接口不存在</td>
              </tr>
              <tr>
                <td width="300px">5003</td>
                <td width="400px">IP请求过于频繁</td>
              </tr>
              <tr>
                <td width="300px">5004</td>
                <td width="400px">用户请求过于频繁</td>
              </tr>
              <tr>
                <td width="300px">5005</td>
                <td width="400px">请求时间过期</td>
              </tr>
              <tr>
                <td width="300px">5006</td>
                <td width="400px">签名信息有误</td>
              </tr>
              <tr>
                <td width="300px">5007</td>
                <td width="400px">无可用结果返回</td>
              </tr>
              <tr>
                <td width="300px">5008</td>
                <td width="400px">数据异常</td>
              </tr>
              <tr>
                <td width="300px">5009</td>
                <td width="400px">请求IP无权限</td>
              </tr>
            </template>
          </t-table>
        </div>
      </div>
      <!-- 5 -->
      <div class="api-content" v-if="currentTab.path == '/5'">
        <div class="t1">接口地址</div>
        <div class="content">
          <!-- <p>测试地址：http://task.domilink.cn:9088/chesafe</p> -->
          <p>正式地址：http://api.basegps.com:9088/chesafe</p>
        </div>
      </div>
      <!-- 6，1-->
      <div class="api-content" v-if="currentTab.path == '/6/1'">
        <div class="t1">接口调用说明(重要)</div>
        <div class="content">
          <div class="t1">
            调用接口为第三方平台主动调用爱车易平台，通过调用相关接口获取设备基本信息、状态信息、定位信息、追踪信息、指令信息、里程信息等相应规则如下:
          </div>
          <p>1.所有接口请求方式均只支持post请求</p>
          <p>2.请求与响应数据格式均为json</p>
          <p>3.接口中所有涉及到到时间戳参数均为13位毫秒时间戳</p>
          <p>4.请求参数timestamp有效值为当前时间正负5分钟有效</p>
          <p>
            5. 当响应参数值为空或-1时，表示该值未获取到，或当前请求设备不支持该属性
          </p>
          <p>6. 业务接口(不包含accessToken接口)请求必须上传通用请求参数</p>
          <p>
            7. 接口中所有涉及到的经纬度信息都为原始GPS坐标系，即WGS-84坐标系
          </p>
          <p>8. 接口调用最大频率为每分钟500次，如超出将会在短时间限制访问</p>
        </div>
      </div>
      <!-- 6，2 -->
      <div class="api-content" v-if="currentTab.path == '/6/2'">
        <div class="t1">业务接口通过请求参数</div>
        <div class="content">
          <p>
            接口调用以下参数为必传项(accessToken类接口除外)，获取token信息见accessToken接口，timestamp参数为13位long类型毫秒时间戳，精确到毫秒，有效值为当前时间正负5分钟，sign签名算法见附录一
          </p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">参数说明</th>
              <th width="200px">数据类型/长度</th>
              <th width="200px">是否必须</th>
              <th width="200px">备注</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">userName</td>
                <td width="200px">用户名</td>
                <td width="200px">String/50</td>
                <td width="200px">是</td>
                <td width="200px">用户或子用户登录名</td>
              </tr>
              <tr>
                <td width="200px">accessToken</td>
                <td width="200px">接口调用凭证</td>
                <td width="200px">string</td>
                <td width="200px">是</td>
                <td width="200px">通过token接口获取</td>
              </tr>
              <tr>
                <td width="200px">timestamp</td>
                <td width="200px">毫秒时间戳</td>
                <td width="200px">long</td>
                <td width="200px">是</td>
                <td width="200px">按当前时间5分钟以内有效</td>
              </tr>
              <tr>
                <td width="200px">sign</td>
                <td width="200px">参数签名</td>
                <td width="200px">string</td>
                <td width="200px">是</td>
                <td width="200px">
                  通过用户名、私钥、时间戳生成的签名值，签名方法见附录一
                </td>
              </tr>
            </template>
          </t-table>
        </div>
      </div>
      <!-- 6,3,1-->
      <div class="api-content" v-if="currentTab.path == '/6/3/1'">
        <div class="content">
          <p>
            接口说明: 获取接口调用凭证accessToken信息,有效期默认30分钟，不用传通用请求参数 请求URL: /open/auth/accessToken.do 请求方式: post
          </p>
          <p>Request:</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">参数说明</th>
              <th width="200px">数据类型/长度</th>
              <th width="200px">是否必须</th>
              <th width="200px">备注</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">user</td>
                <td width="200px">接口调用ID</td>
                <td width="200px">string</td>
                <td width="200px">是</td>
                <td width="200px">爱车易平台分配的接口ID</td>
              </tr>
              <tr>
                <td width="200px">timestamp</td>
                <td width="200px">毫秒时间戳</td>
                <td width="200px">Long/13</td>
                <td width="200px">是</td>
                <td width="200px">时间戳毫秒数</td>
              </tr>
              <tr>
                <td width="200px">sign</td>
                <td width="200px">签名</td>
                <td width="200px">string</td>
                <td width="200px">是</td>
                <td width="200px">
                  通过接口调用ID、私钥、时间戳生成的签名值，签名方法见附录一
                </td>
              </tr>
            </template>
          </t-table>
          <p>Response:</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">参数类型</th>
              <th width="200px">参数说明</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">expireTime</td>
                <td width="200px">long</td>
                <td width="200px">毫秒时间戳,token有效期</td>
              </tr>
              <tr>
                <td width="200px">accessToken</td>
                <td width="200px">string</td>
                <td width="200px">接口调用凭证</td>
              </tr>
            </template>
          </t-table>
          <p>Response示例：</p>
          <pre>
            {
              "retCode":1,
              "retMsg":"success",
              "result":{
                "expireTime":1610347739369,
                "accessToken":"5D0B5CE60764D5B0DF2EA0F9CA010BD2"
              }
            }
          </pre>
        </div>
      </div>
      <!-- 6,4,1-->
      <div class="api-content" v-if="currentTab.path == '/6/4/1'">
        <div class="t1">{{ currentTab.name }}</div>
        <div class="content">
          <p>接口说明: 获取指定设备名称、型号、启用日期、状态、等基本信息</p>
          <p>请求URL: /dinfo/devInfo.do</p>
          <p>请求方式: post</p>
          <p>Request:</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">参数说明</th>
              <th width="200px">数据类型/长度</th>
              <th width="200px">是否必须</th>
              <th width="200px">备注</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">imeis</td>
                <td width="200px">设备Imei号数组</td>
                <td width="200px">string数组</td>
                <td width="200px">是</td>
                <td width="200px">Jsonarray格式，须在userName用户下</td>
              </tr>
            </template>
          </t-table>
          <p>Response:</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">数据类型</th>
              <th width="200px">参数说明</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">imei</td>
                <td width="200px">string</td>
                <td width="200px">设备imei或SN号</td>
              </tr>
              <tr>
                <td width="200px">name</td>
                <td width="200px">string</td>
                <td width="200px">设备名称</td>
              </tr>
              <tr>
                <td width="200px">devType</td>
                <td width="200px">string</td>
                <td width="200px">设备类型，型号</td>
              </tr>
              <tr>
                <td width="200px">plate</td>
                <td width="200px">string</td>
                <td width="200px">车牌号</td>
              </tr>
              <tr>
                <td width="200px">enableDate</td>
                <td width="200px">string</td>
                <td width="200px">设备启用日期，格式”yyyy-MM-dd”</td>
              </tr>
              <tr>
                <td width="200px">expireDate</td>
                <td width="200px">string</td>
                <td width="200px">设备平台到期时间,格式”yyyy-MM-dd”</td>
              </tr>
              <tr>
                <td width="200px">importDate</td>
                <td width="200px">string</td>
                <td width="200px">
                  设备导入时间，即设备初始化时间,格式”yyyy-MM-dd
                </td>
              </tr>
              <tr>
                <td width="200px">networkTime</td>
                <td width="200px">long</td>
                <td width="200px">设备最后与平台的联网时间</td>
              </tr>
              <tr>
                <td width="200px">iccid</td>
                <td width="200px">string</td>
                <td width="200px">Iccid卡号，通过卡号可以获取流量卡时间</td>
              </tr>
              <tr>
                <td width="200px">msisdn</td>
                <td width="200px">string</td>
                <td width="200px">Msisdn卡号，同上</td>
              </tr>
            </template>
          </t-table>
          <p>Response示例：</p>
          <pre>
            {
              "retCode":1,
              "retMsg":"success",
              "result":[
              {
              " devType":"LX_TEST",
              "enableDate":"2020-12-10",
              "iccid":"",
              "importDate":"2020-12-07",
              "name":"ArmorKnight",
              "imei":"684611121300033",
              "expireDate":"2023-12-10",
              "plate":"",
              "msisdn":"",
              "networkTime":1610503580000
              }
              ]
            }
          </pre>
        </div>
      </div>
      <!-- 6,4,2 -->
      <div class="api-content" v-if="currentTab.path == '/6/4/2'">
        <div class="t1">
          {{ currentTab.name }}
        </div>
        <div class="content">
          <p>
            接口说明: 获取指定用户或子用户下所有设备信息，每次返回最多500条记录，按设备sn号排序,如您当前用户或子用户下超过500条记录，您需要新建子用户信息
          </p>
          <p>请求URL: /dinfo/allDevInfo.do</p>
          <p>请求方式: post</p>
          <p>Request:</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">参数说明</th>
              <th width="200px">数据类型/长度</th>
              <th width="200px">是否必须</th>
              <th width="200px">备注</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">pageSize</td>
                <td width="200px">分页大小</td>
                <td width="200px">int</td>
                <td width="200px">否</td>
                <td width="200px">请求的记录总数，最大值500，默认500</td>
              </tr>
            </template>
          </t-table>
          <p>Response：</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">数据类型</th>
              <th width="200px">参数说明</th>
            </template>
            <template slot="table-body">
              <tr>
                <td colspan="3">以下内容同2.1接口获取指定设备信息</td>
              </tr>
            </template>
          </t-table>
          <p>Response示例：</p>
          <pre>
            {
              "retCode":1,
              "retMsg":"success",
              "result":[
                {
                " devType":"LX_TEST",
                "enableDate":"2020-12-10",
                "iccid":"",
                "importDate":"2020-12-07",
                "name":"ArmorKnight",
                "imei":"684611121300033",
                "expireDate":"2023-12-10",
                "plate":"",
                "msisdn":"",
                "networkTime":1610503580000
                }
              ]
            }
          </pre>
        </div>
      </div>
      <!-- 6,5,1 -->
      <div class="api-content" v-if="currentTab.path == '/6/5/1'">
        <div class="t1">
          {{ currentTab.name }}
        </div>
        <div class="content">
          <p>接口说明: 获取指定设备实时心跳状态信息</p>
          <p>请求URL: /dsts/status.do</p>
          <p>请求方式: post</p>
          <p>Request:</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">参数说明</th>
              <th width="200px">数据类型/长度</th>
              <th width="200px">是否必须</th>
              <th width="200px">备注</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">imei</td>
                <td width="200px">设备Imei号</td>
                <td width="200px">string</td>
                <td width="200px">是</td>
                <td width="200px">须在userName用户下</td>
              </tr>
            </template>
          </t-table>
          <p>Response:</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">数据类型</th>
              <th width="200px">参数说明</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">acc</td>
                <td width="200px">int</td>
                <td width="200px">acc状态0为关，1为开(下同)</td>
              </tr>
              <tr>
                <td width="200px">accTime</td>
                <td width="200px">string</td>
                <td width="200px">
                  acc当前状态开始时间(如acc状态为开，表示acc在此时间开启)
                </td>
              </tr>
              <tr>
                <td width="200px">powerOn</td>
                <td width="200px">int</td>
                <td width="200px">外电接通状态</td>
              </tr>
              <tr>
                <td width="200px">electricity</td>
                <td width="200px">int</td>
                <td width="200px">电量值</td>
              </tr>
              <tr>
                <td width="200px">gps</td>
                <td width="200px">int</td>
                <td width="200px">gps开关状态</td>
              </tr>
              <tr>
                <td width="200px">voltage</td>
                <td width="200px">string</td>
                <td width="200px">电压值</td>
              </tr>
              <tr>
                <td width="200px">statusTime</td>
                <td width="200px">string</td>
                <td width="200px">最后获取到的设备状态时间</td>
              </tr>
              <tr>
                <td width="200px">oilElectric</td>
                <td width="200px">int</td>
                <td width="200px">油电接通状态</td>
              </tr>
              <tr>
                <td width="200px">defense</td>
                <td width="200px">int</td>
                <td width="200px">布防状态</td>
              </tr>
              <tr>
                <td width="200px">gsmSignal</td>
                <td width="200px">int</td>
                <td width="200px">设备当前信号值</td>
              </tr>
              <tr>
                <td width="200px">bdCount</td>
                <td width="200px">int</td>
                <td width="200px">设备当前接收到的北斗卫星数量</td>
              </tr>
              <tr>
                <td width="200px">gpsCount</td>
                <td width="200px">int</td>
                <td width="200px">设备当前接收到的gps卫星数量</td>
              </tr>
              <tr>
                <td width="200px">mode</td>
                <td width="200px">int</td>
                <td width="200px">设备当前所处的工作模式</td>
              </tr>
              <tr>
                <td width="200px">modeCount</td>
                <td width="200px">int</td>
                <td width="200px">设备在当前模式下工作次数或工作时间</td>
              </tr>
              <tr>
                <td width="200px">temperature</td>
                <td width="200px">double</td>
                <td width="200px">设备当前工作温度</td>
              </tr>
              <tr>
                <td width="200px">step</td>
                <td width="200px">int</td>
                <td width="200px">当前运动步数(限计步设备)</td>
              </tr>
            </template>
          </t-table>
          <p>Response示例：</p>
          <pre>
            {
              "retCode":1,
              "retMsg":"success",
              "result":{
                "acc":0,
                "powerOn":-1,
                "bdCount":0,
                "accTime":1610415629844,
                "electricity":54,
                "gps":1,
                "voltage":3.86,
                "gpsCount":0,
                "oilElectric":-1,
                "defense":-1,
                "statusTime":1610415614816,
                "gsmSignal":18,
                "mode":-1,
                "modeCount":-1,
                "temperature":-1,
                "step":-1
              }
            }
          </pre>
        </div>
      </div>
      <!-- 6,6,1 -->
      <div class="api-content" v-if="currentTab.path == '/6/6/1'">
        <div class="t1">
          {{ currentTab.name }}
        </div>
        <div class="content">
          <p>接口说明: 获取指定设备实时定位信息</p>
          <p>请求URL: /dpos/location.do</p>
          <p>请求方式: post</p>
          <p>Request:</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">类型说明</th>
              <th width="200px">数据类型/长度</th>
              <th width="200px">是否必须</th>
              <th width="200px">备注</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">imei</td>
                <td width="200px">设备Imei号</td>
                <td width="200px">string</td>
                <td width="200px">是</td>
                <td width="200px">须在userName用户下</td>
              </tr>
            </template>
          </t-table>
          <p>Response:</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">数据类型</th>
              <th width="200px">参数说明</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">locateType</td>
                <td width="200px">int</td>
                <td width="200px">定位方式0为gps、1为基站、2为wifi</td>
              </tr>
              <tr>
                <td width="200px">accuracyType</td>
                <td width="200px">int</td>
                <td width="200px">
                  <p>当定位类型为gps时, 表示定位精度类型</p>
                  <p>1：普通定位</p>
                  <p>2：差分定位</p>
                  <p>4：固定解定位</p>
                  <p>5：浮点定位</p>
                  <p>6：推算定位</p>
                </td>
              </tr>
              <tr>
                <td width="200px">lng</td>
                <td width="200px">double</td>
                <td width="200px">经度</td>
              </tr>
              <tr>
                <td width="200px">lat</td>
                <td width="200px">double</td>
                <td width="200px">纬度</td>
              </tr>
              <tr>
                <td width="200px">altitude</td>
                <td width="200px">double</td>
                <td width="200px">海拔高度</td>
              </tr>
              <tr>
                <td width="200px">speed</td>
                <td width="200px">int</td>
                <td width="200px">速度</td>
              </tr>
              <tr>
                <td width="200px">course</td>
                <td width="200px">int</td>
                <td width="200px">方向</td>
              </tr>
              <tr>
                <td width="200px">locateTime</td>
                <td width="200px">int</td>
                <td width="200px">设备最后定位时间</td>
              </tr>
              <tr>
                <td width="200px">gsmSignal</td>
                <td width="200px">int</td>
                <td width="200px">设备当前信号值</td>
              </tr>
              <tr>
                <td width="200px">bdCount</td>
                <td width="200px">int</td>
                <td width="200px">设备当前接收到的北斗卫星数量</td>
              </tr>
              <tr>
                <td width="200px">gpsCount</td>
                <td width="200px">int</td>
                <td width="200px">设备当前接收到的gps卫星数量</td>
              </tr>
              <tr>
                <td width="200px">step</td>
                <td width="200px">int</td>
                <td width="200px">当前运动步数(限计步设备)</td>
              </tr>
            </template>
          </t-table>
          <p>Response示例：</p>
          <pre>
            {
              "retCode":1,
              "retMsg":"success",
              "result":{
                "lng":113.380507,
                "bdCount":0,
                "locateType":0,
                "accuracyType":0,
                "speed":0,
                "gpsCount":0,
                "gsmSignal":18,
                "course":0,
                "imei":"684611121300033",
                "step":0,
                "lat":23.058267,
                "locateTime":1609857731000
                }
              }
          </pre>
        </div>
      </div>
      <!-- 6，6,2 -->
      <div class="api-content" v-if="currentTab.path == '/6/6/2'">
        <div class="t1">
          {{ currentTab.name }}
        </div>
        <div class="content">
          <p>
            接口说明: 获取设备在指定时间段内的历史轨迹，最大只能查询半年以内轨迹，查询间隔最大不超过1个月，每次最多返回500条记录，按定位时间排序
          </p>
          <p>请求URL: /dpos/hisPosition.do</p>
          <p>请求方式: post</p>
          <p>Request:</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">参数说明</th>
              <th width="200px">数据类型/长度</th>
              <th width="200px">是否必须</th>
              <th width="200px">备注</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">imei</td>
                <td width="200px">设备Imei号</td>
                <td width="200px">string</td>
                <td width="200px">是</td>
                <td width="200px">须在userName用户下</td>
              </tr>
              <tr>
                <td width="200px">from</td>
                <td width="200px">开始时间</td>
                <td width="200px">long/13</td>
                <td width="200px">是</td>
                <td width="200px">开始毫秒时间戳</td>
              </tr>
              <tr>
                <td width="200px">to</td>
                <td width="200px">结束时间</td>
                <td width="200px">long/13</td>
                <td width="200px">是</td>
                <td width="200px">结束毫秒时间戳</td>
              </tr>
            </template>
          </t-table>
          <p>Response示例：</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">参数类型</th>
              <th width="200px">参数说明</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">locateType</td>
                <td width="200px">int</td>
                <td width="200px">定位方式0为gps、1为基站、2为wifi</td>
              </tr>
              <tr>
                <td width="200px">lng</td>
                <td width="200px">double</td>
                <td width="200px">经度</td>
              </tr>
              <tr>
                <td width="200px">lat</td>
                <td width="200px">double</td>
                <td width="200px">纬度</td>
              </tr>
              <tr>
                <td width="200px">altitude</td>
                <td width="200px">double</td>
                <td width="200px">海拔高度</td>
              </tr>
              <tr>
                <td width="200px">accuracyType</td>
                <td width="200px">int</td>
                <td width="200px">精度类型同上</td>
              </tr>
              <tr>
                <td width="200px">speed</td>
                <td width="200px">int</td>
                <td width="200px">速度</td>
              </tr>
              <tr>
                <td width="200px">course</td>
                <td width="200px">int</td>
                <td width="200px">方向</td>
              </tr>
              <tr>
                <td width="200px">locateTime</td>
                <td width="200px">long</td>
                <td width="200px">设备最后定位时间</td>
              </tr>
            </template>
          </t-table>
          <p>Response示例：</p>
          <pre>
            {
              "retCode":1,
              "retMsg":"success",
              "result":[
                {
                  "lng":116.12,
                  "course":100,
                  "lat":23.326,
                  "altitude":23.5,
                  "accuracyType":1,
                  "locateTime":1609209715000,
                  "locateType":0,
                  "speed":50
                }
              ]
            }
          </pre>
        </div>
      </div>
      <!-- 6，7,1 -->
      <div class="api-content" v-if="currentTab.path == '/6/7/1'">
        <div class="t1">
          {{ currentTab.name }}
        </div>
        <div class="content">
          <p>接口说明: 获取指定用户下所有设备跟踪信息，每次最多显示500条记录，可指定设备当前运动状态查询，接口调用方需自行维护分页信息</p>
          <p>请求URL: /monitor/userDevTrack.do</p>
          <p>请求方式: post</p>
          <p>Request:</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">参数说明</th>
              <th width="200px">数据类型/长度</th>
              <th width="200px">是否必须</th>
              <th width="200px">备注</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">status</td>
                <td width="200px">设备状态信息</td>
                <td width="200px">int</td>
                <td width="200px">否</td>
                <td width="200px">0为全部，默认查询所有状态设备， 1在线（包含静止、行驶状态），2离线</td>
              </tr>
              <tr>
                <td width="200px">pageSize</td>
                <td width="200px">分页大小</td>
                <td width="200px">int</td>
                <td width="200px">否</td>
                <td width="200px">每次请求的记录数</td>
              </tr>
            </template>
          </t-table>
          <p>Response：</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">参数类型</th>
              <th width="200px">参数说明</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">totalCount</td>
                <td width="200px">int</td>
                <td width="200px">当前指定用户下所有设备数量</td>
              </tr>
              <tr>
                <td width="200px">onlineCount</td>
                <td width="200px">int</td>
                <td width="200px">在线设备数量</td>
              </tr>
              <tr>
                <td width="200px">offlineCount</td>
                <td width="200px">int</td>
                <td width="200px">离线设备数量</td>
              </tr>
              <tr>
                <td width="200px">status</td>
                <td width="200px">int</td>
                <td width="200px">
                  设备当前状态：<br />
                  1静止 2行驶 3离线
                </td>
              </tr>
              <tr>
                <td width="200px">locateType</td>
                <td width="200px">int</td>
                <td width="200px">定位方式0为gps、1为基站、2为wifi</td>
              </tr>
              <tr>
                <td width="200px">lng</td>
                <td width="200px">double</td>
                <td width="200px">经度</td>
              </tr>
              <tr>
                <td width="200px">lat</td>
                <td width="200px">double</td>
                <td width="200px">纬度</td>
              </tr>
              <tr>
                <td width="200px">altitude</td>
                <td width="200px">double</td>
                <td width="200px">海拔高度</td>
              </tr>
              <tr>
                <td width="200px">speed</td>
                <td width="200px">int</td>
                <td width="200px">速度</td>
              </tr>
              <tr>
                <td width="200px">course</td>
                <td width="200px">int</td>
                <td width="200px">方向</td>
              </tr>
              <tr>
                <td width="200px">accuracyType</td>
                <td width="200px">int</td>
                <td width="200px">
                  <p>当定位类型为gps时, 表示定位精度类型</p>
                  <p>1：普通定位</p>
                  <p>2：差分定位</p>
                  <p>4：固定解定位</p>
                  <p>5：浮点定位</p>
                  <p>6：推算定位</p>
                </td>
              </tr>
              <tr>
                <td width="200px">heartTime</td>
                <td width="200px">long</td>
                <td width="200px">设备最后的状态时间</td>
              </tr>
              <tr>
                <td width="200px">locateTime</td>
                <td width="200px">long</td>
                <td width="200px">设备最后定位时间</td>
              </tr>
            </template>
          </t-table>
          <p>Response示例：</p>
          <pre>
            {
              "retCode":1,
              "retMsg":"success",
              "result":{
                "onlineCount":3,
                "offlineCont":68,
                "totalCount":71
                "dataList":[
                  {
                    "heartTime":1604397036000,
                    "lng":113.380518,
                    "course":0,
                    "imei":"682915102825753",
                    "lat":23.058285,
                    "altitude":23.5,
                    "accuracyType":1
                    "locateTime":1604397075000,
                    "locateType":0,
                    "speed":0,
                    "status":3
                  }
                ] 
              }
            }
          </pre>
        </div>
      </div>
      <!-- 6,,8，1 -->
      <div class="api-content" v-if="currentTab.path == '/6/8/1'">
        <div class="t1">
          {{ currentTab.name }}
        </div>
        <div class="content">
          <p>接口说明: 给终端设备下发查询指令，行车指令信息</p>
          <p>请求URL: /command/send.do</p>
          <p>请求方式: post</p>
          <p>Request:</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">参数说明</th>
              <th width="200px">数据类型/长度</th>
              <th width="200px">是否必须</th>
              <th width="200px">备注</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">imeis</td>
                <td width="200px">设备Imei号</td>
                <td width="200px">string</td>
                <td width="200px">是</td>
                <td width="200px">须在userName用户下</td>
              </tr>
              <tr>
                <td width="200px">command</td>
                <td width="200px">指令信息</td>
                <td width="200px">string/50</td>
                <td width="200px">是</td>
                <td width="200px">给设备下发的指令内容</td>
              </tr>
            </template>
          </t-table>
          <p>Response:</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">数据类型</th>
              <th width="200px">参数说明</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">cmdId</td>
                <td width="200px">string</td>
                <td width="200px">指令ID，用于查询本次查询结果</td>
              </tr>
            </template>
          </t-table>
          <p>Response示例：</p>
          <p>正确返回：</p>
          <pre>
            {
              "retCode":1,
              "retMsg":"success",
              "result":{
                "cmdId":"1579210"
              }
            }
          </pre>
          <p>错误返回：</p>
          <pre>
            {
              "retCode":4301,
              "retMsg":"设备已离线"
            }
            {
              "retCode":4300,
              "retMsg":"指令发送失败"
            }
          </pre>
        </div>
      </div>
      <!-- 6,,8，2 -->
      <div class="api-content" v-if="currentTab.path == '/6/8/2'">
        <div class="t1">
          {{ currentTab.name }}
        </div>
        <div class="content">
          <p>接口说明: 给终端设备下发查询指令，行车指令信息</p>
          <p>请求URL: /command/result.do</p>
          <p>请求方式: post</p>
          <p>Request:</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">参数说明</th>
              <th width="200px">数据类型/长度</th>
              <th width="200px">是否必须</th>
              <th width="200px">备注</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">imeis</td>
                <td width="200px">设备Imei号</td>
                <td width="200px">string</td>
                <td width="200px">是</td>
                <td width="200px">须在userName用户下</td>
              </tr>
              <tr>
                <td width="200px">cmdId</td>
                <td width="200px">指令ID</td>
                <td width="200px">string/50</td>
                <td width="200px">是</td>
                <td width="200px">给设备下发的指令内容</td>
              </tr>
            </template>
          </t-table>
          <p>Response:</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">数据类型</th>
              <th width="200px">参数说明</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">cmdId</td>
                <td width="200px">string</td>
                <td width="200px">指令ID，用于查询本次查询结果</td>
              </tr>
              <tr>
                <td width="200px">cmdSts</td>
                <td width="200px">Int</td>
                <td width="200px">
                  指令发送状态，<br />
                  0为指令发送失败<br />
                  1为指令发送成功，等待设备响应
                </td>
              </tr>
              <tr>
                <td width="200px">cmdResult</td>
                <td width="200px">string</td>
                <td width="200px">指令发送结果描述</td>
              </tr>
              <tr>
                <td width="200px">sendTime</td>
                <td width="200px">Long</td>
                <td width="200px">发送时间</td>
              </tr>
              <tr>
                <td width="200px">resTime</td>
                <td width="200px">Long</td>
                <td width="200px">设备响应时间，未响应时值为0</td>
              </tr>
            </template>
          </t-table>
          <p>Response示例：</p>
          <pre>
            {
              "retCode":1,
              "retMsg":"success",
              "result":{
                "resTime":0,
                "cmdId":1579210,
                "cmdSts":0,
                "cmdResult":"指令已下发,请稍候查询",
                "sendTime":1610453795000  
              }
            }
          </pre>
        </div>
      </div>
      <!-- 6，9,1 -->
      <div class="api-content" v-if="currentTab.path == '/6/9/1'">
        <div class="t1">
          {{ currentTab.name }}
        </div>
        <div class="content">
          <p>接口说明: 通过iccid、msisdn号获取指定设备实时定位信息</p>
          <p>请求URL: /smsInfo/queryCard.do</p>
          <p>请求方式: post</p>
          <p>Request:</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">参数说明</th>
              <th width="200px">数据类型/长度</th>
              <th width="200px">是否必须</th>
              <th width="200px">备注</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">iccid</td>
                <td width="200px">iccid号</td>
                <td width="200px">string</td>
                <td width="200px">是</td>
                <td width="200px">流量卡唯一iccid号</td>
              </tr>
              <tr>
                <td width="200px">msisdn</td>
                <td width="200px">指令ID</td>
                <td width="200px">string</td>
                <td width="200px">是</td>
                <td width="200px">sim卡信息</td>
              </tr>
            </template>
          </t-table>
          <p>Response：</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">数据类型</th>
              <th width="200px">参数说明</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">enableDate</td>
                <td width="200px">string</td>
                <td width="200px">激活时间格式”yyyy-MM-dd”</td>
              </tr>
              <tr>
                <td width="200px">expireDate</td>
                <td width="200px">string</td>
                <td width="200px">卡到期时间格式”yyyy-MM-dd”</td>
              </tr>
              <tr>
                <td width="200px">flowExpire</td>
                <td width="200px">string</td>
                <td width="200px">卡流量到期时间“yyyy-MM-dd”</td>
              </tr>
              <tr>
                <td width="200px">flowPackage</td>
                <td width="200px">string</td>
                <td width="200px">卡流量套餐</td>
              </tr>
              <tr>
                <td width="200px">totalFlow</td>
                <td width="200px">double</td>
                <td width="200px">总流量(单位MB)</td>
              </tr>
              <tr>
                <td width="200px">residualExpire</td>
                <td width="200px">double</td>
                <td width="200px">剩余流量(单位MB)</td>
              </tr>
            </template>
          </t-table>
          <p>Response示例：</p>
          <pre>
            {
              "retCode":1,
              "retMsg":"success",
              "result":{
                "enableDate":"",
                "totalFlow":-1,
                "flowPackage":"30M",
                "expireDate":"2020-10-01",
                "flowExpire":"2020-10-01",
                "residualFlow":2.3
              }
            }
          </pre>
        </div>
      </div>
      <!-- 6,10,1 -->
      <div class="api-content" v-if="currentTab.path == '/6/10/1'">
        <div class="t1">
          {{ currentTab.name }}
        </div>
        <div class="content">
          <p>接口说明: 通过指定imei号获取设备分段里程信息</p>
          <p>请求URL: /run/mileage.do</p>
          <p>请求方式: post</p>
          <p>Request:</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">参数说明</th>
              <th width="200px">数据类型/长度</th>
              <th width="200px">是否必须</th>
              <th width="200px">备注</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">imeis</td>
                <td width="200px">设备Imei号</td>
                <td width="200px">string</td>
                <td width="200px">是</td>
                <td width="200px">须在userName用户下</td>
              </tr>
              <tr>
                <td width="200px">cmdId</td>
                <td width="200px">指令ID</td>
                <td width="200px">string/50</td>
                <td width="200px">是</td>
                <td width="200px">给设备下发的指令内容</td>
              </tr>
            </template>
          </t-table>
          <p>Response:</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">数据类型</th>
              <th width="200px">参数说明</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">time</td>
                <td width="200px">int</td>
                <td width="200px">行驶总时间(单位分钟)</td>
              </tr>
              <tr>
                <td width="200px">stopCount</td>
                <td width="200px">int</td>
                <td width="200px">静止次数</td>
              </tr>
              <tr>
                <td width="200px">overSpeedCount</td>
                <td width="200px">int</td>
                <td width="200px">超速次数</td>
              </tr>
              <tr>
                <td width="200px">mileage</td>
                <td width="200px">int</td>
                <td width="200px">总里程信息，单位km</td>
              </tr>
            </template>
          </t-table>
          <p>Response示例：</p>
          <pre>
            {
              "retCode":1,
              "retMsg":"success",
              "result":[
                {
                  "stopCount":1,
                  "time":"2021-01-13",
                  "overSpeedCount":0,
                  "mileage":61
                }
              ]
            }
          </pre>
        </div>
      </div>
      <!-- 6，10,2 -->
      <div class="api-content" v-if="currentTab.path == '/6/10/2'">
        <div class="t1"></div>
        <div class="content">
          <p>接口说明: 查询设备在时间段内的总里程信息，精确到天(查询最小单位为天)，以每天的里程信息汇总</p>
          <p>请求URL: /run/totalMileage.do</p>
          <p>请求方式: post</p>
          <p>Request:</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">参数说明</th>
              <th width="200px">数据类型/长度</th>
              <th width="200px">是否必须</th>
              <th width="200px">备注</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">imeis</td>
                <td width="200px">设备Imei号数组</td>
                <td width="200px">string数组</td>
                <td width="200px">是</td>
                <td width="200px">Jsonarray格式，须在userName用户下</td>
              </tr>
              <tr>
                <td width="200px">from</td>
                <td width="200px">开始时间</td>
                <td width="200px">long/13</td>
                <td width="200px">是</td>
                <td width="200px">开始毫秒时间戳</td>
              </tr>
              <tr>
                <td width="200px">to</td>
                <td width="200px">结束时间</td>
                <td width="200px">long/13</td>
                <td width="200px">是</td>
                <td width="200px">结束毫秒时间戳</td>
              </tr>
            </template>
          </t-table>
          <p>Response:</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">数据类型</th>
              <th width="200px">参数说明</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">imei</td>
                <td width="200px">string</td>
                <td width="200px">设备Imei号</td>
              </tr>
              <tr>
                <td width="200px">time</td>
                <td width="200px">int</td>
                <td width="200px">行驶总时间(单位分钟)</td>
              </tr>
              <tr>
                <td width="200px">stopCount</td>
                <td width="200px">int</td>
                <td width="200px">静止次数</td>
              </tr>
              <tr>
                <td width="200px">overSpeedCount</td>
                <td width="200px">int</td>
                <td width="200px">超速次数</td>
              </tr>
              <tr>
                <td width="200px">mileage</td>
                <td width="200px">int</td>
                <td width="200px">总里程信息，单位km</td>
              </tr>
            </template>
          </t-table>
          <p>Response示例：</p>
          <pre>
            {
              "retCode":1,
              "retMsg":"success",
              "result":[
                {
                 "stopCount":5,
                  "imei":"357784086071568",
                  "time":"",
                  "overSpeedCount":0,
                  "mileage":186   
                },
                {
                  "stopCount":5,
                  "imei":"684611121300033",
                  "time":"",
                  "overSpeedCount":0,
                  "mileage":119
                }
              ]
            }
          </pre>
        </div>
      </div>
      <!-- 6,11,1 -->
      <div class="api-content" v-if="currentTab.path == '/6/11/1'">
        <div class="t1">
          {{ currentTab.name }}
        </div>
        <div class="content">
          <p>接口说明: 查询设备在时间段内所有报警类型的报警总数,支持半年内查询数据，查询间隔最大1个月</p>
          <p>请求URL: /alarm/alarmSummary.do</p>
          <p>请求方式: post</p>
          <p>Request:</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">参数说明</th>
              <th width="200px">数据类型/长度</th>
              <th width="200px">是否必须</th>
              <th width="200px">备注</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">imei</td>
                <td width="200px">设备Imei号</td>
                <td width="200px">String/15</td>
                <td width="200px">是</td>
                <td width="200px">须在userName用户下</td>
              </tr>
              <tr>
                <td width="200px">from</td>
                <td width="200px">开始时间</td>
                <td width="200px">long/13</td>
                <td width="200px">是</td>
                <td width="200px">开始毫秒时间戳</td>
              </tr>
              <tr>
                <td width="200px">to</td>
                <td width="200px">结束时间</td>
                <td width="200px">long/13</td>
                <td width="200px">是</td>
                <td width="200px">结束毫秒时间戳</td>
              </tr>
            </template>
          </t-table>
          <p>Response：</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">数据类型</th>
              <th width="200px">参数说明</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">alarmId</td>
                <td width="200px">int</td>
                <td width="200px">报警类型ID,如时间段内无该报警，则不会显示该报警类型</td>
              </tr>
              <tr>
                <td width="200px">count</td>
                <td width="200px">int</td>
                <td width="200px">报警次数</td>
              </tr>
            </template>
          </t-table>
          <p>Response示例：</p>
          <pre>
            {
              "retCode":1,
              "retMsg":"success",
              "result":[
                {
                  "alarmId":6,
                  "count":3
                },
                {
                  "alarmId":21,
                  "count":1
                },
                {
                  "alarmId":22,
                  "count":2
                }
              ]
            }
          </pre>
        </div>
      </div>
      <!-- 6,11,2 -->
      <div class="api-content" v-if="currentTab.path == '/6/11/2'">
        <div class="t1">
          {{ currentTab.name }}
        </div>
        <div class="content">
          <p>接口说明: 查询设备时间段内指定报警类型的报警详情,支持半年内查询数据，查询间隔最大1个月 最多查询500条记录</p>
          <p>请求URL: /alarm/alarmDetail.do</p>
          <p>请求方式: post</p>
          <p>Request:</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">参数说明</th>
              <th width="200px">数据类型/长度</th>
              <th width="200px">是否必须</th>
              <th width="200px">备注</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">imei</td>
                <td width="200px">设备Imei号</td>
                <td width="200px">String/15</td>
                <td width="200px">是</td>
                <td width="200px">须在userName用户下</td>
              </tr>
              <tr>
                <td width="200px">alarmId</td>
                <td width="200px">报警类型ID</td>
                <td width="200px">Int</td>
                <td width="200px">是</td>
                <td width="200px">报警类型</td>
              </tr>
              <tr>
                <td width="200px">from</td>
                <td width="200px">开始时间</td>
                <td width="200px">long/13</td>
                <td width="200px">是</td>
                <td width="200px">开始毫秒时间戳</td>
              </tr>
              <tr>
                <td width="200px">to</td>
                <td width="200px">结束时间</td>
                <td width="200px">long/13</td>
                <td width="200px">是</td>
                <td width="200px">结束毫秒时间戳</td>
              </tr>
            </template>
          </t-table>
          <p>Response:</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">数据类型/长度</th>
              <th width="200px">参数说明</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">alarmId</td>
                <td width="200px">int</td>
                <td width="200px">报警类型，详情见附录二</td>
              </tr>
              <tr>
                <td width="200px">alarmTime</td>
                <td width="200px">long</td>
                <td width="200px">报警推送的时间</td>
              </tr>
              <tr>
                <td width="200px">speed</td>
                <td width="200px">int</td>
                <td width="200px">行车速度</td>
              </tr>
              <tr>
                <td width="200px">course</td>
                <td width="200px">int</td>
                <td width="200px">行驶方向</td>
              </tr>
              <tr>
                <td width="200px">locateTime</td>
                <td width="200px">long</td>
                <td width="200px">定位时间,毫秒时间戳</td>
              </tr>
              <tr>
                <td width="200px">lng</td>
                <td width="200px">double</td>
                <td width="200px">原始坐标经度</td>
              </tr>
              <tr>
                <td width="200px">lat</td>
                <td width="200px">double</td>
                <td width="200px">原始坐标纬度</td>
              </tr>
              <tr>
                <td width="200px">locateType</td>
                <td width="200px">int</td>
                <td width="200px">0为GPS定位，1为基站定位，2为wifi</td>
              </tr>
              <tr>
                <td width="200px">acc</td>
                <td width="200px">int</td>
                <td width="200px">点火状态0关闭，1开启</td>
              </tr>
            </template>
          </t-table>
          <p>Response示例：</p>
          <pre>
            {
              "retCode":1,
              "retMsg":"success",
              "result":[
                {
                  "acc":0,
                  "lng":113.381533,
                  "alarmTime":1608963051000,
                  "alarmId":21,
                  "course":157,
                  "lat":23.053781,
                  "locateTime":1575290923000,
                  "locateType":0,
                  "speed":12
                },
                {
                  "acc":0,
                  "lng":113.39938,
                  "alarmTime":1609049424000,
                  "alarmId":22,
                  "course":0,
                  "lat":23.042299,
                  "locateTime":1575333960000,
                  "locateType":0,
                  "speed":0
                }
              ]
            }
          </pre>
        </div>
      </div>
      <!-- 7,1 -->
      <div class="api-content" v-if="currentTab.path == '/7/1'">
        <div class="t1">
          {{ currentTab.name }}
        </div>
        <div class="content">
          <div class="t1">
            推送接口为爱车易平台主动推送给第三方平台，推送信息包含设备实时状态信息，位置信息，报警信息等，推送规则如下:
          </div>
          <p>1.推送协议仅支持http协议post方式</p>
          <p>2.推送数据格式仅支持json</p>
          <p>3.推送最长超时等待时间为3S，第三方需在规定时间内校验数据并立即返回，如因第三方原因导致连续推送失败超过5次，当前推送将被关闭，第二天凌晨零点会重新开启</p>
          <p>4.爱车易平台不会解析第三方平台的响应信息，收到响应报文即推送成功.</p>
          <p>5.第三方未接收到报文或如因数据异常或故障需要补传时，须人工向爱车易平台申请报文补传，暂不支持自动补传功能</p>
        </div>
      </div>
      <!-- 7,2 -->
      <div class="api-content" v-if="currentTab.path == '/7/2'">
        <div class="t1">
          {{ currentTab.name }}
        </div>
        <div class="content">
          <p>接口说明: 爱车易平台向第三方推送设备实时的定位、报警信息，其中当值为-1时，表示设备不支持或未获取到该属性值</p>
          <p>请求URL: 由第三方平台提供</p>
          <p>请求方式: post</p>
          <p>Request:</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数</th>
              <th width="200px">参数说明</th>
              <th width="200px">数据类型/长度</th>
              <th width="200px">是否必须</th>
              <th width="200px">备注</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">sn</td>
                <td width="200px">设备Imei号</td>
                <td width="200px">string</td>
                <td width="200px">是</td>
                <td width="200px">当前用户或子用户下设备号</td>
              </tr>
              <tr>
                <td width="200px">userName</td>
                <td width="200px">用户名</td>
                <td width="200px">string</td>
                <td width="200px">是</td>
                <td width="200px">当前设备所属用户登陆名称</td>
              </tr>
              <tr>
                <td width="200px">plate</td>
                <td width="200px">车牌号</td>
                <td width="200px">string</td>
                <td width="200px">是</td>
                <td width="200px">车牌号信息</td>
              </tr>
              <tr>
                <td width="200px">speed</td>
                <td width="200px">速度</td>
                <td width="200px">double</td>
                <td width="200px">是</td>
                <td width="200px">行车速度</td>
              </tr>
              <tr>
                <td width="200px">course</td>
                <td width="200px">方向</td>
                <td width="200px">int</td>
                <td width="200px">是</td>
                <td width="200px">行驶方向</td>
              </tr>
              <tr>
                <td width="200px">altitude</td>
                <td width="200px">高度</td>
                <td width="200px">double</td>
                <td width="200px">否</td>
                <td width="200px">海拔高度</td>
              </tr>
              <tr>
                <td width="200px">locateTime</td>
                <td width="200px">定位时间</td>
                <td width="200px">long</td>
                <td width="200px">是</td>
                <td width="200px">实时定位时间，单位毫秒值</td>
              </tr>
              <tr>
                <td width="200px">statusTime</td>
                <td width="200px">状态时间</td>
                <td width="200px">long</td>
                <td width="200px">是</td>
                <td width="200px">状态时间,设备最后一次心跳时间</td>
              </tr>
              <tr>
                <td width="200px">lon</td>
                <td width="200px">经度</td>
                <td width="200px">double</td>
                <td width="200px">是</td>
                <td width="200px">原始坐标经度</td>
              </tr>
              <tr>
                <td width="200px">lat</td>
                <td width="200px">纬度</td>
                <td width="200px">double</td>
                <td width="200px">是</td>
                <td width="200px">原始坐标纬度</td>
              </tr>
              <tr>
                <td width="200px">battery</td>
                <td width="200px">电量</td>
                <td width="200px">double</td>
                <td width="200px">否</td>
                <td width="200px">设备实时电量信息,单位百分比</td>
              </tr>
              <tr>
                <td width="200px">voltage</td>
                <td width="200px">电压</td>
                <td width="200px">double</td>
                <td width="200px">是</td>
                <td width="200px">实时电压信息</td>
              </tr>
              <tr>
                <td width="200px">locateType</td>
                <td width="200px">定位方式</td>
                <td width="200px">int</td>
                <td width="200px">是</td>
                <td width="200px">0为GPS定位，1为基站定位，2为wifi</td>
              </tr>
              <tr>
                <td width="200px">accuracyType</td>
                <td width="200px">精度类型</td>
                <td width="200px">int</td>
                <td width="200px">否</td>
                <td width="200px">定位精度类型，同上</td>
              </tr>
              <tr>
                <td width="200px">alertType</td>
                <td width="200px">报警类型</td>
                <td width="200px">int</td>
                <td width="200px">是</td>
                <td width="200px">报警类型，当前位置是否有报警信息，详情见附录二</td>
              </tr>
              <tr>
                <td width="200px">acc</td>
                <td width="200px">acc状态</td>
                <td width="200px">int</td>
                <td width="200px">否</td>
                <td width="200px">点火状态0为关闭，1为开启</td>
              </tr>
              <tr>
                <td width="200px">accTime</td>
                <td width="200px">acc状态时间</td>
                <td width="200px">long</td>
                <td width="200px">否</td>
                <td width="200px">acc状态变更时间，如当前状态为开，即表示acc初次开启的时间，反之则表示acc初次关闭的时间</td>
              </tr>
            </template>
          </t-table>
          <p>Request示例：</p>
          <pre>
            [
              {
                "sn":"123451234500001",
                "userName":"test",
                "plate":"",
                "speed":50.0,
                "course":120,
                "altitude":20.5,
                "locateTime":1597033800000,
                "statusTime":1597033800000,
                "lon":127.265592,
                "lat":42.332860,
                "battery":99.5,
                "voltage":10.5,
                "locateType":0,
                "accuracyType":0,
                "alertType":1,
                "acc":0,
                "accTime":1597033800000
              }
            ]
          </pre>
          <p>Response:</p>
          <t-table>
            <template slot="table-head">
              <th width="200px">参数名</th>
              <th width="200px">类型</th>
              <th width="200px">说明</th>
              <th width="200px">备注</th>
            </template>
            <template slot="table-body">
              <tr>
                <td width="200px">retCode</td>
                <td width="200px">int</td>
                <td width="200px">返回状态码</td>
                <td width="200px">1为响应成功</td>
              </tr>
              <tr>
                <td width="200px">retMsg</td>
                <td width="200px">int</td>
                <td width="200px">返回值描述</td>
                <td width="200px">默认值success</td>
              </tr>
            </template>
          </t-table>
          <p>Response示例：</p>
          <pre>
            {
              "retCode":1,
              "retMsg":"success"
            }
          </pre>
        </div>
      </div>
      <!-- 8,1 -->
      <div class="api-content" v-if="currentTab.path == '/8/1'">
        <div class="t1">
          {{ currentTab.name }}
        </div>
        <div class="content">
          <div class="CodeMirror">
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span>public class SignUtil {</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl10">/***</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl10">* @param user    用户名</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl10">* @param secret  私钥</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl10">* @param time    请求毫秒时间戳</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl10">*/</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl15">public static String sign(String user,String secret,String time){</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl20">String plainStr = user+secret+time;</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl20">try {</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl25">MessageDigest messageDigest = MessageDigest.getInstance("MD5");</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl25">byte[] byteDigest = messageDigest.digest(plainStr.getBytes("UTF-8"));</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl25">return bytesToHex(byteDigest);</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl20">} catch (Exception e) {;</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl20">}</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl20">return null;</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span>}</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl10"> /**<br>
                  * 功能：将字节数组转化为大写HEX字符串<br>
                  * @param byteArray  原始字节数组<br>
                  * @return  大写HEX字符串<br>
                  */
                </span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl10">public static String bytesToHex(byte[] byteArray){</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl15">StringBuffer stringBuffer = new StringBuffer(byteArray.length * 2);</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl15">for(int i=0, count=byteArray.length; i</span><span>&lt;</span><span>count; i++){</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl20">String tem = Integer.toHexString(byteArray[i] & 0xFF);</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl20">if(tem.length() == 1){</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl25">stringBuffer.append("0");</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl20">}</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl20">stringBuffer.append(tem.toUpperCase());</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl15">}</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl15">return stringBuffer.toString();</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span class="pl10">}</span>
              </pre>
            </div>
            <div class="dr">
              <pre role="presentation" class="CodeMirror-line">
                <span>}</span>
              </pre>
            </div>
          </div>
        </div>
      </div>
      <!-- 8,2 -->
      <div class="api-content" v-if="currentTab.path == '/8/2'">
        <div class="t1">
          {{ currentTab.name }}
        </div>
        <div class="content">
          <t-table>
            <template slot="table-head">
              <th width="200px">报警类型ID</th>
              <th width="200px">报警名称</th>
            </template>
            <template slot="table-body">
              <tr v-for="item in alarmList" :key="item.num">
                <td>{{ item.num }}</td>
                <td>{{ item.text }}</td>
              </tr>
            </template>
          </t-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Table from "./Table.vue";
export default {
  name: "apiDoc",
  components: {
    "t-table": Table,
  },
  data: () => ({
    pageNum: 1,
    pageTotalNum: 0,
    numPages: 1, //pdf文件总页数
    pdfSrc: "",
    activeIndex: "/1",
    menuTab: [
      {
        path: "/1",
        name: "爱车易开放接口",
      },
      {
        path: "/2",
        name: "API规格",
      },
      {
        path: "/3",
        name: "开放接口使用步骤",
      },
      {
        path: "/4",
        name: "通用错误码",
      },
      {
        path: "/5",
        name: "接口地址",
      },
      {
        path: "/6",
        name: "调用接口",
        children: [
          {
            path: "/6/1",
            name: "接口调用说明(重要)",
          },
          {
            path: "/6/2",
            name: "业务接口通用请求参数",
          },
          {
            path: "/6/3",
            name: "1. accessToken信息",
            children: [
              {
                path: "/6/3/1",
                name: "1.1 业务接口通用请求参数",
              },
            ],
          },
          {
            path: "/6/4",
            name: "2. 获取设备基本信息",
            children: [
              {
                path: "/6/4/1",
                name: "2.1 获取指定设备信息",
              },
              {
                path: "/6/4/2",
                name: "2.2 获取用户下所有设备信息",
              },
            ],
          },
          {
            path: "/6/5",
            name: "3.获取设备状态信息",
            children: [
              {
                path: "/6/5/1",
                name: "3.1 获取指定设备状态信息",
              },
            ],
          },
          {
            path: "/6/6",
            name: "4.获取设备定位信息",
            children: [
              {
                path: "/6/6/1",
                name: "4.1 获取指定设备定位信息",
              },
              {
                path: "/6/6/2",
                name: "4.2 获取设备历史轨迹",
              },
            ],
          },
          {
            path: "/6/7",
            name: "5.设备跟踪信息",
            children: [
              {
                path: "/6/7/1",
                name: "5.1 获取用户下所有设备跟踪信息",
              },
            ],
          },
          {
            path: "/6/8",
            name: "6.设备指令信息",
            children: [
              {
                path: "/6/8/1",
                name: "6.1 下发指令信息",
              },
              {
                path: "/6/8/2",
                name: "6.2 通过指令ID查询指令结果",
              },
            ],
          },
          {
            path: "/6/9",
            name: "7.流量卡信息",
            children: [
              {
                path: "/6/9/1",
                name: "7.1 获取流量卡信息",
              },
            ],
          },
          {
            path: "/6/10",
            name: "8.设备里程信息",
            children: [
              {
                path: "/6/10/1",
                name: "8.1 查询指定设备分段里程信息",
              },
              {
                path: "/6/10/2",
                name: "8.2 查询指定设备总里程信息",
              },
            ],
          },
          {
            path: "/6/11",
            name: "9.报警信息",
            children: [
              {
                path: "/6/11/1",
                name: "9.1 查询报警汇总信息",
              },
              {
                path: "/6/11/2",
                name: "9.2 查询报警信息",
              },
            ],
          },
        ],
      },
      {
        path: "/7",
        name: "推送接口",
        children: [
          {
            path: "/7/1",
            name: "推送接收说明(重要)",
          },
          {
            path: "/7/2",
            name: "设备推送监控信息",
          },
        ],
      },
      {
        path: "/8",
        name: "附录",
        children: [
          {
            path: "/8/1",
            name: "附录一: 签名计算方法JAVA版本",
          },
          {
            path: "/8/2",
            name: "附录二: 报警信息",
          },
        ],
      },
    ],
    currentTab: {
      path: "/1",
      name: "爱车易开放接口",
    },
    alarmList: [
      {
        num: 1,
        text: "正常",
      },
      {
        num: 2,
        text: "震动报警",
      },
      {
        num: 3,
        text: "断电报警",
      },
      {
        num: 4,
        text: "低电报警",
      },
      {
        num: 5,
        text: "SOS求救",
      },
      {
        num: 6,
        text: "超速报警",
      },
      {
        num: 7,
        text: "出围栏报警",
      },
      {
        num: 8,
        text: "位移报警",
      },
      {
        num: 9,
        text: "GPS天线短路报警",
      },
      {
        num: 10,
        text: "GPS天线开路报警",
      },
      {
        num: 11,
        text: "进入盲区报警",
      },
      {
        num: 12,
        text: "离开盲区报警",
      },
      {
        num: 13,
        text: "外电低电报警",
      },
      {
        num: 14,
        text: "外电低电保护报警",
      },
      {
        num: 15,
        text: "启动报警",
      },
      {
        num: 16,
        text: "开门报警",
      },
      {
        num: 17,
        text: "车门关闭",
      },
      {
        num: 20,
        text: "开关报警",
      },
      {
        num: 21,
        text: "感光报警",
      },
      {
        num: 22,
        text: "碰撞报警",
      },
      {
        num: 23,
        text: "侧翻报警",
      },
      {
        num: 24,
        text: "车门报警",
      },
      {
        num: 25,
        text: "离线报警",
      },
      {
        num: 28,
        text: "弱信号报警",
      },
      {
        num: 29,
        text: "通信网络信号恢复报警",
      },
      {
        num: 30,
        text: "唤醒报警",
      },
      {
        num: 31,
        text: "急加速",
      },
      {
        num: 32,
        text: "急减速",
      },
      {
        num: 33,
        text: "急左转",
      },
      {
        num: 34,
        text: "急右转",
      },
      {
        num: 35,
        text: "守卫报警",
      },
      {
        num: 36,
        text: "汽车停止",
      },
      {
        num: 37,
        text: "汽车运行",
      },
      {
        num: 38,
        text: "道路颠簸",
      },
      {
        num: 39,
        text: "道路正常",
      },
      {
        num: 40,
        text: "驶入围栏",
      },
      {
        num: 41,
        text: "驶出围栏",
      },
      {
        num: 42,
        text: "取消SOS报警",
      },
      {
        num: 43,
        text: "蓝牙断连锁车报警",
      },
      {
        num: 44,
        text: "考勤打卡",
      },
      {
        num: 45,
        text: "静止报警",
      },
      {
        num: 46,
        text: "干扰屏蔽锁车报警",
      },
      {
        num: 47,
        text: "蓝牙连接异常",
      },
      {
        num: 48,
        text: "油电恢复",
      },
    ],
  }),
  methods: {
    handlechange(item) {
      // console.log(item);
      this.currentTab = item;
    },
    handleSelect(key, keyPath) {
      // console.log("key", key);
      // console.log("path", keyPath);
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.pl10 {
  padding-left: 20px;
}
.pl15 {
  padding-left: 25px;
}
.pl20 {
  padding-left: 30px;
}
.pl25 {
  padding-left: 35px;
}
.zhushi {
  color: #6a737d;
}
.CodeMirror-line {
  word-break: normal;
  padding: 0 4px;
  border-radius: 0;
  border-width: 0;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  margin: 0;
  white-space: pre;
  word-wrap: normal;
  line-height: inherit;
  color: inherit;
  z-index: 2;
  position: relative;
  overflow: visible;
  font-variant-ligatures: contextual;
}
.dr {
  position: relative;
}
.CodeMirror {
  background: rgb(250, 250, 250);
  padding: 10px;
  margin-left: 15px;
  border: 1px solid rgb(239, 240, 240);
  border-radius: 4px;
  font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 18px;
  color: #595959;
  direction: ltr;
}
pre {
  font-family: monospace, monospace;
  font-size: 1em;
  margin-top: 0;
  margin-bottom: 1em;
  overflow: auto;
}
.main-table {
  margin-right: 16px;
}
.t1 {
  font-size: 16px;
  padding: 10px 0;
  font-weight: 700;
}
.t2 {
  font-size: 14px;
  padding: 8px 0;
  font-weight: 700;
}
.right-content-api {
  position: relative;
  flex: 1;
  .top-title {
    position: absolute;
    top: 0;
    left: 0;
    height: 50px;
    width: 100%;
    // background: #e6e6ef;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #ccc;
    padding-left: 10px;
    display: flex;
    font-size: 14px;
  }
  .api-content {
    margin-top: 50px;
    height: calc(100vh - 66px);
    overflow: scroll;
    padding: 10px;
    width: 1000px;
    .content {
      line-height: 25px;
      font-size: 14px;
      margin-bottom: 10px;
      padding: 10px;
    }
  }
}
.api-main-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.api-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
}
.left-tabbar {
  width: 300px;
  overflow: auto;
  height: 100vh;
  // position: fixed;
  // top: 0;
  // left: 0;
  background-color: #fff;
  // border-right: 1px solid #e6e6e6;
}
.right-content-api {
  flex: 1;
}
.pdf-content {
  height: calc(100% - 30px);
  overflow: scroll;
  width: 1100px;
  margin: auto;
}
</style>

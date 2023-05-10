<template>
  <div class="table-content-g">
    <table class="api-table" border="0" cellpadding="0" cellspacing="0" width="100%">
      <thead>
        <tr>
          <slot name="table-head"></slot>
        </tr>
      </thead>
      <tbody>
        <slot name="table-body"></slot>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "TableComp",
  data: () => ({}),
};
</script>

<style lang="scss" scoped>
.api-table {
  margin-left: 16px;
  margin-bottom: 20px;
}
.api-table tr th {
  background: #eee;
  height: 30px;
}
.api-table tr td,
.api-table tr th {
  border: 1px solid #ddd;
  padding: 6px 10px;
  text-align: center;
}
</style>

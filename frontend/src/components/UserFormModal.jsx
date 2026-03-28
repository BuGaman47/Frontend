import { useState, useEffect } from 'react'
import { useDepartmentStore } from '../store/departmentStore'
import { userService } from '../services/userService'

const EMPTY_FORM = {
  first_name: '',
  last_name: '',
  age: '',
  gender: 'male',
  email: '',
  phone: '',
  department_id: '',
}

const EMPTY_ADDRESS = {
  house_no: '',
  street: '',
  district: '',
  province: '',
  postal_code: '',
}

// ── Validation (mirrors backend rules) ────────────────────────
function validateForm(form, addressEnabled, address) {
  const errors = {}

  if (!form.first_name || form.first_name.trim().length < 2)
    errors.first_name = 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร'
  if (!form.last_name || form.last_name.trim().length < 2)
    errors.last_name = 'นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร'

  const age = parseInt(form.age)
  if (isNaN(age) || age < 1 || age > 120)
    errors.age = 'อายุต้องเป็นตัวเลข 1–120'

  if (!['male', 'female', 'unspecified'].includes(form.gender))
    errors.gender = 'กรุณาเลือกเพศ'

  if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'รูปแบบอีเมลไม่ถูกต้อง'

  if (form.phone && !/^[0-9\-+\s()]{8,20}$/.test(form.phone))
    errors.phone = 'รูปแบบเบอร์โทรไม่ถูกต้อง (8–20 หลัก)'

  if (addressEnabled) {
    if (!address.house_no?.trim())
      errors['address.house_no'] = 'กรุณากรอกบ้านเลขที่'
    if (!address.district?.trim())
      errors['address.district'] = 'กรุณากรอกเขต/อำเภอ'
    if (!address.province?.trim())
      errors['address.province'] = 'กรุณากรอกจังหวัด'
    if (!/^\d{5}$/.test(address.postal_code))
      errors['address.postal_code'] = 'รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก'
  }

  return errors
}

// ── Field helpers ─────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div className="form-control">
      <label className="label py-1">
        <span className="label-text text-xs font-medium">{label}</span>
      </label>
      {children}
      {error && (
        <label className="label py-0">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────
export default function UserFormModal({ id = 'user-modal', editUser, onSuccess }) {
  const { departments } = useDepartmentStore()

  const [form, setForm]                   = useState(EMPTY_FORM)
  const [address, setAddress]             = useState(EMPTY_ADDRESS)
  const [addressEnabled, setAddrEnabled]  = useState(false)
  const [errors, setErrors]               = useState({})
  const [serverError, setServerError]     = useState(null)
  const [loading, setLoading]             = useState(false)

  // populate when editing
  useEffect(() => {
    if (editUser) {
      setForm({
        first_name:    editUser.first_name    || '',
        last_name:     editUser.last_name     || '',
        age:           editUser.age           || '',
        gender:        editUser.gender        || 'male',
        email:         editUser.email         || '',
        phone:         editUser.phone         || '',
        department_id: editUser.department?.id || '',
      })
      if (editUser.address) {
        setAddrEnabled(true)
        setAddress({
          house_no:    editUser.address.house_no    || '',
          street:      editUser.address.street      || '',
          district:    editUser.address.district    || '',
          province:    editUser.address.province    || '',
          postal_code: editUser.address.postal_code || '',
        })
      } else {
        setAddrEnabled(false)
        setAddress(EMPTY_ADDRESS)
      }
    } else {
      setForm(EMPTY_FORM)
      setAddress(EMPTY_ADDRESS)
      setAddrEnabled(false)
    }
    setErrors({})
    setServerError(null)
  }, [editUser])

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const setA = (k, v) => setAddress((a) => ({ ...a, [k]: v }))

  const handleSubmit = async () => {
    const errs = validateForm(form, addressEnabled, address)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setServerError(null)
    try {
      const payload = {
        ...form,
        age:           parseInt(form.age),
        department_id: form.department_id || null,
        address:       addressEnabled ? address : null,
      }

      if (editUser) {
        await userService.update(editUser.id, payload)
      } else {
        await userService.create(payload)
      }

      document.getElementById(id)?.close()
      onSuccess?.()
    } catch (err) {
      const data = err.response?.data
      if (data?.errors?.length) {
        const mapped = {}
        data.errors.forEach((e) => { mapped[e.field] = e.message })
        setErrors(mapped)
      } else {
        setServerError(data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <dialog id={id} className="modal">
      <div className="modal-box max-w-2xl w-full">
        {/* Header */}
        <h3 className="font-bold text-lg mb-1">
          {editUser
            ? `✏️ แก้ไข: ${editUser.first_name} ${editUser.last_name}`
            : '➕ เพิ่มผู้ใช้ใหม่'}
        </h3>

        {serverError && (
          <div className="alert alert-error alert-sm py-2 mb-3 text-sm">
            <span>{serverError}</span>
          </div>
        )}

        {/* User fields */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <Field label="ชื่อ *" error={errors.first_name}>
            <input
              className={`input input-bordered input-sm ${errors.first_name ? 'input-error' : ''}`}
              value={form.first_name}
              onChange={(e) => setF('first_name', e.target.value)}
            />
          </Field>

          <Field label="นามสกุล *" error={errors.last_name}>
            <input
              className={`input input-bordered input-sm ${errors.last_name ? 'input-error' : ''}`}
              value={form.last_name}
              onChange={(e) => setF('last_name', e.target.value)}
            />
          </Field>

          <Field label="อายุ *" error={errors.age}>
            <input
              type="number"
              min={1}
              max={120}
              className={`input input-bordered input-sm ${errors.age ? 'input-error' : ''}`}
              value={form.age}
              onChange={(e) => setF('age', e.target.value)}
            />
          </Field>

          <Field label="เพศ *" error={errors.gender}>
            <select
              className="select select-bordered select-sm"
              value={form.gender}
              onChange={(e) => setF('gender', e.target.value)}
            >
              <option value="male">ชาย</option>
              <option value="female">หญิง</option>
              <option value="unspecified">ไม่ระบุ</option>
            </select>
          </Field>

          <Field label="อีเมล *" error={errors.email}>
            <input
              type="email"
              className={`input input-bordered input-sm ${errors.email ? 'input-error' : ''}`}
              value={form.email}
              onChange={(e) => setF('email', e.target.value)}
            />
          </Field>

          <Field label="เบอร์โทร" error={errors.phone}>
            <input
              type="tel"
              placeholder="ไม่บังคับ"
              className={`input input-bordered input-sm ${errors.phone ? 'input-error' : ''}`}
              value={form.phone}
              onChange={(e) => setF('phone', e.target.value)}
            />
          </Field>

          <div className="col-span-2">
            <Field label="แผนก" error={errors.department_id}>
              <select
                className="select select-bordered select-sm w-full"
                value={form.department_id}
                onChange={(e) => setF('department_id', e.target.value)}
              >
                <option value="">— ไม่มีแผนก —</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        {/* Address toggle */}
        <div className="divider my-3 text-xs text-base-content/50">
          <label className="label cursor-pointer gap-2">
            <span className="label-text font-semibold">📍 ที่อยู่</span>
            <input
              type="checkbox"
              className="toggle toggle-primary toggle-sm"
              checked={addressEnabled}
              onChange={(e) => setAddrEnabled(e.target.checked)}
            />
            <span className="label-text text-xs text-base-content/50">
              {addressEnabled ? 'เปิด' : 'ปิด (ไม่มีที่อยู่)'}
            </span>
          </label>
        </div>

        {addressEnabled && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 bg-base-200 rounded-xl p-4">
            <Field label="บ้านเลขที่ *" error={errors['address.house_no']}>
              <input
                className={`input input-bordered input-sm bg-base-100 ${errors['address.house_no'] ? 'input-error' : ''}`}
                value={address.house_no}
                onChange={(e) => setA('house_no', e.target.value)}
              />
            </Field>

            <Field label="ถนน" error={errors['address.street']}>
              <input
                placeholder="ไม่บังคับ"
                className="input input-bordered input-sm bg-base-100"
                value={address.street}
                onChange={(e) => setA('street', e.target.value)}
              />
            </Field>

            <Field label="เขต/อำเภอ *" error={errors['address.district']}>
              <input
                className={`input input-bordered input-sm bg-base-100 ${errors['address.district'] ? 'input-error' : ''}`}
                value={address.district}
                onChange={(e) => setA('district', e.target.value)}
              />
            </Field>

            <Field label="จังหวัด *" error={errors['address.province']}>
              <input
                className={`input input-bordered input-sm bg-base-100 ${errors['address.province'] ? 'input-error' : ''}`}
                value={address.province}
                onChange={(e) => setA('province', e.target.value)}
              />
            </Field>

            <div className="col-span-2">
              <Field label="รหัสไปรษณีย์ * (5 หลัก)" error={errors['address.postal_code']}>
                <input
                  maxLength={5}
                  className={`input input-bordered input-sm bg-base-100 w-full ${errors['address.postal_code'] ? 'input-error' : ''}`}
                  value={address.postal_code}
                  onChange={(e) => setA('postal_code', e.target.value.replace(/\D/g, ''))}
                />
              </Field>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="modal-action mt-4">
          <form method="dialog">
            <button className="btn btn-ghost" disabled={loading}>
              ยกเลิก
            </button>
          </form>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : editUser ? (
              'บันทึกการแก้ไข'
            ) : (
              'เพิ่มผู้ใช้'
            )}
          </button>
        </div>
      </div>

      {/* Click outside to close */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}
